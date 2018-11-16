function showWorld() {
    clearCanvas();

    if (document.getElementById('mapData').value === 'elevation') {
        drawElevationPolygons();
    } else if (document.getElementById('mapData').value === 'precipitation') {
        drawWeatherPolygons();
        drawPrecipitation();
    }
    drawCoastLine();
    drawnRiver();
}

function drawTriangles() {
    contextCanvas.beginPath();
    delaunay.render(contextCanvas);
    contextCanvas.strokeStyle = '#ccc';
    contextCanvas.stroke();
}

function drawSite() {
    contextCanvas.beginPath();
    delaunay.renderPoints(contextCanvas);
    contextCanvas.fillStyle = '#f00';
    contextCanvas.fill();
}

function drawElevationPolygons() {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= 0.2) {
            colorPolygon(i, colorNatural(1 - sites[i].height));
        } else {
            if (sites[i].type === 'Lake') {
                colorPolygon(i, '#3C8CBC');
            } else if (sites[i].type === 'Recif') {
                colorPolygon(i, '#646B9A');
            } else {
                colorPolygon(i, '#604E99');
            }
        }
    }
}

function drawWeatherPolygons() {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= 0.2) {
            colorPolygon(i, colorWeather(sites[i].precipitation));
        } else {
            if (sites[i].type === 'Lake') {
                colorPolygon(i, '#3C8CBC');
            } else if (sites[i].type === 'Recif') {
                colorPolygon(i, '#646B9A');
            } else {
                colorPolygon(i, '#604E99');
            }
        }
    }
}

function colorPolygon(polygonID, color) {
    contextCanvas.beginPath();
    voronoi.renderCell(polygonID, contextCanvas);
    contextCanvas.fillStyle = color;
    contextCanvas.fill();
}

function clearCanvas() {
    contextCanvas.clearRect(0, 0, widthCanvas, heightCanvas);
}
