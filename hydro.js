var north = document.getElementById('north'),
east = document.getElementById('east'),
south = document.getElementById('south'),
west = document.getElementById('west');

var winds_buffer, raining;
var riversData;

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
    
    if (north.checked + east.checked + south.checked + west.checked === 0) {
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

    let sides = north.checked + east.checked + south.checked + west.checked,
    precipInit = precipitationInput.value / sides,
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

function generateFlux(){
    riversData = new Array();
    let riverID = 0,
    aval = new Array();

    for (let i = 0; i < landPolygonID.length; i++) {
        let neighborsPolygons = new Array(),
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
console.log("GenerateFluxEnd");
}

function drawnFlux(){
    let riverData,
    x,
    y,
    line;
}