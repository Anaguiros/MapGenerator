/* globals document d3 delaunay voronoi*/
/* globals sites moved clicked*/
/* globals drawPrecipitation drawCoastLine drawnRiver*/

const widthCanvas = 1228;
const heightCanvas = 640;

const colorNatural = d3.scaleSequential(d3.interpolateSpectral);
const colorWeather = d3.scaleSequential(d3.interpolateBlues);

d3.select('canvas')
    .attr('width', widthCanvas)
    .attr('height', heightCanvas)
    .on('touchmove mousemove', moved)
    .on('click', clicked);

const contextCanvas = d3.select('canvas').node().getContext('2d');

function clearCanvas() {
    contextCanvas.clearRect(0, 0, widthCanvas, heightCanvas);
}

function colorPolygon(polygonID, color) {
    contextCanvas.beginPath();
    voronoi.renderCell(polygonID, contextCanvas);
    contextCanvas.fillStyle = color;
    contextCanvas.fill();
}

function drawElevationPolygons() {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= 0.2) {
            colorPolygon(i, colorNatural(1 - sites[i].height));
        } else if (sites[i].type === 'Lake') {
            colorPolygon(i, '#3C8CBC');
        } else if (sites[i].type === 'Recif') {
            colorPolygon(i, '#646B9A');
        } else {
            colorPolygon(i, '#604E99');
        }
    }
}

function drawWeatherPolygons() {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= 0.2) {
            colorPolygon(i, colorWeather(sites[i].precipitation));
        } else if (sites[i].type === 'Lake') {
            colorPolygon(i, '#3C8CBC');
        } else if (sites[i].type === 'Recif') {
            colorPolygon(i, '#646B9A');
        } else {
            colorPolygon(i, '#604E99');
        }
    }
}

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
