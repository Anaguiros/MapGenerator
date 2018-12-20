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

function colorTriangle(points, color) {
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

function drawElevationTriangles() {
    for (const triangle of delaunay.trianglePolygons()) {
        let heightAverage = 0;
        let typeTriangle = [];
        for (let i = 0; i < triangle.length - 1; i++) {
            const pointCoord = triangle[i];
            const site = sites[delaunay.find(pointCoord[0], pointCoord[1])];
            heightAverage += site.height;
            typeTriangle.push(site.type);
        }
        heightAverage /= (triangle.length - 1);
        typeTriangle = typeTriangle.sort((triangleA, triangleB) =>
            typeTriangle.filter((tempTriangle) => tempTriangle === triangleA).length -
            typeTriangle.filter((tempTriangle) => tempTriangle === triangleB).length).pop();

        if (typeTriangle === 'Island') {
            colorTriangle(triangle, colorNatural(altitudeMax - heightAverage));
        } else if (typeTriangle === 'Lake') {
            colorTriangle(triangle, '#3C8CBC');
        } else if (typeTriangle === 'Recif') {
            colorTriangle(triangle, '#646B9A');
        } else {
            colorTriangle(triangle, '#604E99');
        }
    }
}

function showWorld() {
    clearScreen();

    if (document.getElementById('mapData').value === 'elevation') {
        if (document.getElementById('mapStyle').value === 'triangle') {
            drawElevationTriangles();
        } else {
            drawElevationPolygons();
        }
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
