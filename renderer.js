// Libs import
/* globals document d3 delaunay voronoi*/

// Functions import
/* globals drawPrecipitation drawCoastLine drawnRiver moved clicked */

// Variables import
/* globals altitudeOcean sites */

/* exported showWorld */

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
    const points = voronoi.cellPolygon(polygonID);
    contextCanvas.moveTo(points[0][0], points[0][1]);
    contextCanvas.beginPath();
    for (let i = 1; i < points.length; i++) {
        contextCanvas.lineTo(points[i][0], points[i][1]);
    }
    contextCanvas.closePath();
    contextCanvas.fillStyle = color;
    contextCanvas.fill();
    contextCanvas.strokeStyle = color;
    contextCanvas.stroke();
}

function drawElevationPolygons() {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= altitudeOcean) {
            colorPolygon(i, colorNatural(altitudeMax - sites[i].height));
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
        if (sites[i].height >= altitudeOcean) {
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
