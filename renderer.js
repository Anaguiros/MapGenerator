function showWorld(){
    clearCanvas();
    
    if(document.getElementById('mapData').value === 'elevation'){
        drawElevationPolygons();
    } else if(document.getElementById('mapData').value === 'precipitation'){
        drawWeatherPolygons();
        drawPrecipitation();
    } else {

    }
    drawCoastLine();
    drawnRiver();
}

function drawTriangles(){
    context.beginPath();
    delaunay.render(context);
    context.strokeStyle = "#ccc";
    context.stroke();
}

function drawSite(){
    context.beginPath();
    delaunay.renderPoints(context);
    context.fillStyle = "#f00";
    context.fill();
}

function drawElevationPolygons(){
    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            colorPolygon(i, colorNatural(1-sites[i].height));
        } else {
            if(sites[i].type === 'Lake'){
                colorPolygon(i, '#3C8CBC');
            } else if(sites[i].type === 'Recif') {
                colorPolygon(i, '#646B9A');
            } else {
                colorPolygon(i, '#604E99');
            }
            
        }
        
    }
}

function drawWeatherPolygons(){
    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            colorPolygon(i, colorWeather(sites[i].precipitation));
        } else {
            if(sites[i].type === 'Lake'){
                colorPolygon(i, '#3C8CBC');
            } else if(sites[i].type === 'Recif') {
                colorPolygon(i, '#646B9A');
            } else {
                colorPolygon(i, '#604E99');
            }
            
        }
        
    }
}

function colorPolygon(polygonID, color){
    context.beginPath();
    voronoi.renderCell(polygonID, context);
    context.fillStyle = color;
    context.fill();
}

function clearCanvas(){
    context.clearRect(0,0,width_canvas,height_canvas);
}