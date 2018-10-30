var north = document.getElementById('north'),
east = document.getElementById('east'),
south = document.getElementById('south'),
west = document.getElementById('west');

var winds_buffer, raining;

function randomizeWinds(){
    north.checked = Math.random() >= 0.75;
    east.checked = Math.random() >= 0.75;
    south.checked = Math.random() >= 0.75;
    west.checked = Math.random() >= 0.75;
}

function initPrecipitation(){
    for (let i = 0; i < sites.length; i++) {
        sites[i].precipitation = 0;
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
                        precipitation = 0;
                        sites[nearestID].precipitation += precipitation;
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
                        precipitation = 0;
                        sites[nearestID].precipitation += precipitation;
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
                        precipitation = 0;
                        sites[nearestID].precipitation += precipitation;
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
                        precipitation = 0;
                        sites[nearestID].precipitation += precipitation;
                    }
                    raining.push([x,y])
                }
            }
        });
    }

    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            let precipMoyenne = [sites[i].precipitation];
            for (let neighborID of delaunay.neighbors(i)){
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