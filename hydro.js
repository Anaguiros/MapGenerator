var north = document.getElementById('north'),
east = document.getElementById('east'),
south = document.getElementById('south'),
west = document.getElementById('west');

var winds_buffer, raining;
var riversData, riverID, riversOrder, confluence

function randomizeWinds(){
    north.checked = Math.random() >= 0.75;
    east.checked = Math.random() >= 0.75;
    south.checked = Math.random() >= 0.75;
    west.checked = Math.random() >= 0.75;
}

function initPrecipitation(){
    for (let i = 0; i < sites.length; i++) {
        sites[i].precipitation = 0.01;
        sites[i].flux = 0.01;
    }
}

function generatePrecipitation(){

    winds_buffer = new Array();
    raining = new Array();

    if (randomWinds.checked) {
        randomizeWinds();
    }

    let sides = north.checked + east.checked + south.checked + west.checked;

    if(sides == 0){
        sides = 1;
        let side = Math.random();
        if (side >= 0.25 && side < 0.5) {
            north.checked = true;
        } else if (side >= 0.5 && side < 0.75) {
            east.checked = true;
        } else if (side >= 0.75) {
            south.checked = true;
        } else {
            west.checked = true;
        }
    }

    let precipInit = precipitationInput.value / Math.sqrt(sides),
    selection = 30 / sides;

    if (north.checked){
        let frontier = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(sites[i][1] < selection && sites[i][0] > width_canvas*0.1 && sites[i][0] < width_canvas*0.9){
                frontier.push(i);
            }
        }
        frontier.forEach(startPolygonID => {
            let x = sites[startPolygonID][0],
            y = sites[startPolygonID][1],
            precipitation = precipInit;

            winds_buffer.push([x,y]);

            while (y < height_canvas && precipitation > 0) {
                y += 5;
                x += Math.random() * 10 - 5;
                let nearestID = delaunay.find(x,y),
                height = sites[nearestID].height;
                if(height >= 0.2){
                    if(height < 0.6){
                        let rain = Math.random() * height;
                        precipitation -= rain;
                        sites[nearestID].precipitation += rain;
                    } else {
                        sites[nearestID].precipitation += precipitation;
                        precipitation = 0;
                    }
                    raining.push([x,y])
                }
            }
        });

    }
    if (east.checked){
        let frontier = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(sites[i][0] > width_canvas - selection && sites[i][1] > height_canvas*0.1 && sites[i][1] < height_canvas*0.9){
                frontier.push(i);
            }
        }
        frontier.forEach(startPolygonID => {
            let x = sites[startPolygonID][0],
            y = sites[startPolygonID][1],
            precipitation = precipInit;

            winds_buffer.push([x,y]);

            while (x > 0 && precipitation > 0) {
                x -= 5
                y += Math.random() * 10 - 5;  
                let nearestID = delaunay.find(x,y),
                height = sites[nearestID].height;
                if(height >= 0.2){
                    if(height < 0.6){
                        let rain = Math.random() * height;
                        precipitation -= rain;
                        sites[nearestID].precipitation += rain;
                    } else {
                        sites[nearestID].precipitation += precipitation;
                        precipitation = 0;
                    }
                    raining.push([x,y])
                }
            }
        });
    }
    if(south.checked){
        let frontier = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(sites[i][1] > height_canvas - selection && sites[i][0] > width_canvas*0.1 && sites[i][0] < width_canvas*0.9){
                frontier.push(i);
            }
        }
        frontier.forEach(startPolygonID => {
            let x = sites[startPolygonID][0],
            y = sites[startPolygonID][1],
            precipitation = precipInit;

            winds_buffer.push([x,y]);

            while (y > 0 && precipitation > 0) {
                y -= 5;
                x += Math.random() * 10 - 5;
                let nearestID = delaunay.find(x,y),
                height = sites[nearestID].height;
                if(height >= 0.2){
                    if(height < 0.6){
                        let rain = Math.random() * height;
                        precipitation -= rain;
                        sites[nearestID].precipitation += rain;
                    } else {
                        sites[nearestID].precipitation += precipitation;
                        precipitation = 0;
                    }
                    raining.push([x,y])
                }
            }
        });
    }
    if(west.checked){
        let frontier = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(sites[i][0] < selection && sites[i][1] > height_canvas*0.1 && sites[i][1] < height_canvas*0.9){
                frontier.push(i);
            }
        }
        frontier.forEach(startPolygonID => {
            let x = sites[startPolygonID][0],
            y = sites[startPolygonID][1],
            precipitation = precipInit;

            winds_buffer.push([x,y]);

            while (x < width_canvas && precipitation > 0) {
                x += 5;
                y += Math.random() * 10 -5;
                let nearestID = delaunay.find(x,y),
                height = sites[nearestID].height;
                if(height >= 0.2){
                    if(height < 0.6){
                        let rain = Math.random() * height;
                        precipitation -= rain;
                        sites[nearestID].precipitation += rain;
                    } else {
                        sites[nearestID].precipitation += precipitation;
                        precipitation = 0;
                    }
                    raining.push([x,y])
                }
            }
        });
    }

    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            let precipMoyenne = [sites[i].precipitation];
            for (const neighborID of delaunay.neighbors(i)){
                precipMoyenne.push(sites[neighborID].precipitation);
            }
            let moyenne = d3.mean(precipMoyenne);
            sites[i].precipitation = moyenne;
            sites[i].flux = moyenne;
        } 
    }

}

function drawPrecipitation(){
    winds_buffer.forEach(wind => {
        drawCircle(wind[0],wind[1],1,'white'); 
    });

    raining.forEach(rain => {
        drawCircle(rain[0],rain[1], 0.3, 'blue');
    });
}

function generateRiver(){
    riversData = new Array();
    riverID = 0;
    riversOrder = new Array();
    confluence = new Array();

    for (let i = 0; i < landPolygonID.length; i++) {
        let neighborsPolygons = new Array(),
        aval = new Array(),
        localMinID,
        sommetsLocaux = new Array(),
        idCellLand = landPolygonID[i],
        xDiff,
        yDiff;

        for (const neighborID of delaunay.neighbors(idCellLand)) {
            neighborsPolygons.push(neighborID);
            sommetsLocaux.push(sites[neighborID].height);
            if(sites[neighborID].height < 0.2){
                xDiff = (sites[idCellLand][0] + sites[neighborID][0])/2;
                yDiff = (sites[idCellLand][1] + sites[neighborID][1])/2;
                aval.push({
                    x:      xDiff,
                    y:      yDiff,
                    cell:   neighborID
                });
            }
        }

        localMinID = neighborsPolygons[sommetsLocaux.indexOf(Math.min(...sommetsLocaux))];

        if(sites[idCellLand].flux > 0.85){
            if(!sites[idCellLand].river){
                //Nouvelle river
                sites[idCellLand].river = riverID;
                riverID++;
                let rnd = Math.random / 1000;
                riversOrder.push({r: sites[idCellLand].river, order: rnd});
                riversData.push({
                    river:  sites[idCellLand].river,
                    cell:   idCellLand,
                    x:      sites[idCellLand][0],
                    y:      sites[idCellLand][1],
                    type:   "source"
                });
            }

            if(!sites[localMinID].river){
                //On ajoute la river en cours à la cellule aval si elle ne possède pas déjà de river
                sites[localMinID].river = sites[idCellLand].river;
            } else {
                const riverTo = sites[localMinID].river;
                const iRiver      = riversData.filter(element => element.river == sites[idCellLand].river);
                const minRiver    = riversData.filter(element => element.river == riverTo);
                let iRiverLength = iRiver.length,
                minRiverLength = minRiver.length;

                if(iRiverLength >= minRiverLength){
                    riversOrder[sites[idCellLand].river].order == iRiverLength;
                    sites[localMinID].river = sites[idCellLand].river;
                    iRiverLength++;
                    minRiverLength--;
                } else {
                    if(!riversOrder[riverTo]){
                        console.error("Order error");
                        riversOrder[riverTo] = new Array();
                        riversOrder[riverTo].order = minRiverLength;
                    } else {
                        riversOrder[riverTo].order += minRiverLength;
                    }
                }

                //Marque Confluence
                if(sites[localMinID].height >= 0.2 && iRiverLength > 1 && minRiverLength > 1){
                    if(iRiverLength >= minRiverLength){
                        confluence.push({id: localMinID, s: idCellLand, l: iRiverLength, r: sites[idCellLand].river});
                    }
                    if(!sites[localMinID].confluence){
                        sites[localMinID].confluence = 2;
                        let cellTo = minRiver[minRiverLength - 1].cell;
                        if(cellTo == localMinID){
                            cellTo = minRiver[minRiverLength - 2].cell;
                        }
                        confluence.push({id: localMinID, s: cellTo, l: minRiverLength - 1, r: riverTo});
                    } else {
                        sites[localMinID].confluence++;
                    }
                    if(iRiverLength < minRiverLength){
                        confluence.push({id: localMinID, s: idCellLand, l: iRiverLength, r: sites[idCellLand].river});
                    }
                }
            }
        }

        sites[localMinID].flux += sites[idCellLand].flux;
        if(sites[idCellLand].precipitation * 0.97 > sites[localMinID].precipitation){
            sites[localMinID].precipitation = sites[idCellLand].precipitation * 0.97;
        }

        if(sites[idCellLand].river){
            if(sites[localMinID].height < 0.2){
                //Deverse riviere dans ocean
                if(sites[idCellLand].flux > 14 && aval.length > 1 && !sites[idCellLand].confluence){
                    for (let c = 0; c < aval.length; c++) {
                        if(c==0){
                            riversData.push({
                                river:  sites[idCellLand].river,
                                cell:   idCellLand,
                                x:      sites[idCellLand][0],
                                y:      sites[idCellLand][1],
                                type:   "delta",
                                aval:   aval[0].cell
                            });
                        } else {
                            riversData.push({
                                river:  riverID,
                                cell:   idCellLand,
                                x:      sites[idCellLand][0],
                                y:      sites[idCellLand][1],
                                type:   "course"
                            });
                            riversData.push({
                                river:  riverID,
                                cell:   idCellLand,
                                x:      aval[c].x,
                                y:      aval[c].y,
                                type:   "delta"
                            });
                            riverID++;
                        }
                    }
                } else {
                    //Estuaire de la riviere
                    let x = aval[0].x + ((aval[0].x - sites[idCellLand][0])/10);
                    let y = aval[0].y + ((aval[0].y - sites[idCellLand][1])/10);
                    riversData.push({
                        river:  sites[idCellLand].river,
                        cell:   idCellLand,
                        x:      x,
                        y:      y,
                        type:   'estuary',
                        aval:   aval[0].cell
                    });
                }
            } else {
                //Segment de la rivière
                riversData.push({
                    river:  sites[idCellLand].river,
                    cell:   localMinID,
                    x:      sites[localMinID][0],
                    y:      sites[localMinID][1],
                type:       "course"
                });
            }
        }
    }

    riversOrder.sort(function (a,b) {
        if (a.order < b.order){
            return 1;
        } else if (a.order > b.order){
            return -1;
        } else {
            return 0;
        }
    });
}

function drawnRiver(){
    let line = d3.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;})
    .curve(d3.curveCatmullRom.alpha(0.1))
    .context(context)
    ;

    let confAngles = new Array(),
    side = 1;

    for (let i = 0; i < riversOrder.length; i++) {
        let dataRiver = riversData.filter(element => element.river == riversOrder[i].r),
        order = riversOrder[i].r;

        if(dataRiver.length > 1){
            let riverAmended = new Array();
            if(dataRiver.length > 2 || dataRiver[1].type == "delta"){
                //Découpage du segment en tiers
                for (let r = 0; r < dataRiver.length; r++) {
                    let dX = dataRiver[r].x,
                    dY = dataRiver[r].y;
                    riverAmended.push({x: dX, y: dY});
                    if(r+1 < dataRiver.length){
                        let eX = dataRiver[r+1].x,
                        eY = dataRiver[r+1].y,
                        angle = Math.atan2(eY-dY, eX-dX);
                        if(dataRiver[r+1].type == "course"){
                            let mean = (sizeInput.valueAsNumber / 10) + Math.random() * (sizeInput.valueAsNumber / 10),
                            firstThirdX = (dX * 2 + eX) / 3,
                            firstThirdY = (dY * 2 + eY) / 3,
                            secondThirdX = (dX + eX * 2) / 3,
                            secondThirdY = (dY + eY * 2) / 3;

                            if (Math.random() > 0.5) {side *= -1;}
                            firstThirdX += -Math.sin(angle) * mean * side;
                            firstThirdY += Math.cos(angle) * mean * side;
                            if (Math.random() > 0.6) {side *= -1;}
                            secondThirdX += Math.sin(angle) * mean * side;
                            secondThirdY += -Math.cos(angle) * mean * side;
                            riverAmended.push({x: firstThirdX, y: firstThirdY});
                            riverAmended.push({x: secondThirdX, y: secondThirdY});
                        } else {
                            let mean = (sizeInput.valueAsNumber / 20) + Math.random() * (sizeInput.valueAsNumber / 20),
                            middleX = (dX + eX) / 2,
                            middleY = (dY + eY) / 2;
                            middleX += -Math.sin(angle) * mean * side;
                            middleY += Math.cos(angle) * mean * side;
                            riverAmended.push({x: middleX, y: middleY});
                        }
                    }
                }
            }
            //Dessin line river
            if(dataRiver[1].type == "delta"){
                context.beginPath();
                line(riverAmended);
                context.lineWidth = 0.6;
                context.strokeStyle = "steelblue";
                context.stroke();
            } else {
                let count =1,
                width = 0;
                for (let s = 0; s < riverAmended.length/3; s++) {
                    let start, middle, end;
                    
                    if(s === Math.floor(riverAmended.length/3)){
                        start = riverAmended[s*3 - 1],
                        end = riverAmended[s*3];
                    } else {
                        start = riverAmended[s*3],
                        middle = riverAmended[s*3 + 1],
                        end = riverAmended[s*3 + 2];
                    }

                    let cellDestinationID = delaunay.find(end.x, end.y),
                    xNode = end.x,
                    yNode = end.y,
                    riverWidth = (count + width * 3) / 50;
                    count++;
                    if(cellDestinationID){
                        if(sites[cellDestinationID].confluence){
                            let confluenceData = confluence.filter(element => element.id == cellDestinationID),
                            angle;
                            if(s+1 !== Math.floor(riverAmended.length/3) && middle){
                                angle = Math.atan2(end.y - middle.y, end.x - middle.x);
                                confAngles[cellDestinationID] = angle;
                                //let midX = (start.x + middle.x) / 2,
                                //midY = (start.y + middle.y) / 2;
                                if(angle == undefined){
                                    angle = Math.atan2(end.y - middle.y, end.x - middle.x);
                                }

                            }
                            count = 0;
                            width = Math.pow(sites[cellDestinationID].flux, 0.9);
                            let df = (width * 3 / 50 - riverWidth) /2,
                            cellControle1 = confluenceData[0].s,
                            cellControle2 = confluenceData[1].s,
                            baseX = (sites[cellControle1][0] + sites[cellControle2][0]) / 2,
                            baseY = (sites[cellControle1][1] + sites[cellControle2][1]) / 2,
                            xCurve = -Math.sin(angle) * df + end.x,
                            yCurve = Math.cos(angle) * df + end.y,
                            xRiver = Math.sin(angle) * df + end.x,
                            yRiver = -Math.cos(angle) * df + end.y,
                            cross = ((baseX-end.x)*(start.y-end.y) - (baseY-end.y)*(start.x-end.x));

                            if(cross > 0){
                                xNode = xRiver;
                                yNode = yRiver;
                            } else {
                                xNode = xCurve;
                                yNode = yCurve;
                            }
                        }
                    }

                    context.beginPath();
                    line(riverAmended);
                    context.lineWidth = riverWidth;
                    context.strokeStyle = "steelblue";
                    context.stroke();
                }
            }
        }
    }
}