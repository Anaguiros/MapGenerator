var north = document.getElementById('north'),
east = document.getElementById('east'),
south = document.getElementById('south'),
west = document.getElementById('west');

var winds_buffer, raining;
var riversData, riverID;

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

        if(sites[idCellLand].flux > 0.6){
            if(!sites[idCellLand].river){
                sites[idCellLand].river = riverID;
                riverID++;
                riversData.push({
                    river:  sites[idCellLand].river,
                    cell:   idCellLand,
                    x:      sites[idCellLand][0],
                    y:      sites[idCellLand][1],
                    type:   "source"
                });
            }

            if(!sites[localMinID].river){
                sites[localMinID].river = sites[idCellLand].river;
            } else {
                const iRiver      = riversData.filter(element => element.river == sites[idCellLand].river);
                const minRiver    = riversData.filter(element => element.river == sites[localMinID].river);
                if(iRiver.length >= minRiver.length){
                    sites[localMinID].river = sites[idCellLand].river;
                }
            }
        }

        sites[localMinID].flux += sites[idCellLand].flux;
        if(sites[idCellLand].precipitation * 0.9 > sites[localMinID].precipitation){
            sites[localMinID].precipitation = sites[idCellLand].precipitation * 0.9;
        }
        if(sites[localMinID].height < 0.2 && sites[idCellLand].river){
            //Deverse riviere dans ocean
            if(sites[idCellLand].flux > 15 && aval.length > 1){
                //Delta de la riviere
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
                    }
                    riverID++;
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

function drawnRiver(){
    let xLinear = d3.scaleLinear().domain([0, width_canvas]).range([0, width_canvas]),
	yLinear = d3.scaleLinear().domain([0, height_canvas]).range([0, height_canvas]),
    line = d3.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;})
    .curve(d3.curveCatmullRom.alpha(0))
    .context(context)
    ;

/*    let  lineGenerator = d3.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;})
    .curve(d3.curveCatmullRom.alpha(1))
    .context(context);
*/
    for (let i = 0; i < riverID; i++) {
        let riverData = riversData.filter(element => element.river == i);

        if(riverData.length > 1){
            let riverAmended = new Array(),
            riverRendered = new Array();
            if(riverData.length > 2){
                for (let r = 0; r < riverData.length; r++) {
                    riverAmended.push({x: riverData[r].x, y: riverData[r].y});
                    if(r+2 < riverData.length){
                        let dX = riverData[r].x,
                        dY = riverData[r].y,
                        mean = (sizeInput.valueAsNumber / 10) + Math.random() * (sizeInput.valueAsNumber / 10),
                        firstThirdX = (dX * 2 + riverData[r+1].x) / 3,
                        firstThirdY = (dY * 2 + riverData[r+1].y) / 3,
                        secondThirdX = (dX + riverData[r+1].x * 2) / 3,
                        secondThirdY = (dY + riverData[r+1].y * 2) / 3;
                        if (Math.random() > 0.5) {
                            firstThirdX += mean;
                            secondThirdX -= mean;
                        } else {
                            firstThirdX -= mean;
                            secondThirdX += mean;
                        }
                        if (Math.random() > 0.5) {
                            firstThirdY += mean;
                            secondThirdY -= mean;
                        } else {
                            firstThirdY -= mean;
                            secondThirdY += mean;
                        }
                        riverAmended.push({x:firstThirdX,y:firstThirdY});
                        riverAmended.push({x:secondThirdX,y:secondThirdY});
                    }
                }

                for (let s = 0; s < riverAmended.length/3; s++) {
                    let riverArray = new Array(),
                    riverWidth = 0;

                    if(s === Math.floor(riverAmended.length/3)){
                        let start = riverAmended[3*s],
                        end = riverAmended[3*s + 1];
                        
                        riverWidth = Math.sqrt((s/sizeInput.valueAsNumber) + (sites[delaunay.find(end.x, end.y)].flux /(sizeInput.valueAsNumber/2)));

                        riverArray.push(start);
                        riverArray.push(end);

                        riverRendered.push(start);
                        riverRendered.push(end);
                    } else {
                        let start = riverAmended[3*s],
                        firstThird = riverAmended[3*s + 1],
                        secondThird = riverAmended[3*s + 2],
                        next = riverAmended[3*s + 3];

                        riverWidth = Math.sqrt((s/sizeInput.valueAsNumber) + (sites[delaunay.find(start.x, start.y)].flux /(sizeInput.valueAsNumber/2)));

                        riverArray.push(start);
                        riverArray.push(firstThird);
                        riverArray.push(secondThird);
                        riverArray.push(next);

                        riverRendered.push(start);
                        riverRendered.push(firstThird);
                        riverRendered.push(secondThird);
                        riverRendered.push(next);
                    }

                    //if(riverWidth > 0.5){
                    //    riverWidth *= 0.9;
                    //}

                    context.beginPath();
                    line(riverArray);
                    context.lineWidth = riverWidth;
                    context.strokeStyle = "steelblue";
                    context.stroke();
                }
            } else if(riverData[1].type == 'delta'){
                let middleX = (riverData[0].x + riverData[1].x) / 2 + (0.2 + Math.random*0.1),
                middleY = (riverData[0].y + riverData[1].y) / 2 + (0.2 + Math.random*0.1);
                
                riverAmended.push({x: riverData[0].x, y: riverData[0].y});
                riverAmended.push({x: middleX, y: middleY});
                riverAmended.push({x: riverData[1].x, y: riversData[1].y});

                riverRendered.push({x: riverData[0].x, y: riverData[0].y});
                riverRendered.push({x: middleX, y: middleY});
                riverRendered.push({x: riverData[1].x, y: riversData[1].y});

                context.beginPath();
                line(riverAmended);
                context.lineWidth = 0.6;
                context.strokeStyle = "steelblue";
                context.stroke();
            }
            //console.log(riverRendered);

/*            context.strokeStyle = '#999';
            context.lineWidth = 1;
            context.beginPath();
            lineGenerator(riverRendered);
            context.stroke();
*/
        }
    }
}