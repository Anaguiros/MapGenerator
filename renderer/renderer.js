// Libs import
/* globals document d3 delaunay voronoi*/

// Functions import
/* globals drawPrecipitation drawnRiver moved clicked */

// Variables import
/* globals altitudeOcean sites contextCanvas*/

/* exported showWorld */

const colorNatural = d3.scaleSequential(d3.interpolateSpectral);
const colorWeather = d3.scaleSequential(d3.interpolateBlues);

function colorPolygon(polygonID, color, voronoiBorderVisible = false) {
    canvasColorPolygon(voronoi.cellPolygon(polygonID), color, voronoiBorderVisible);
}

function colorTriangle(points, color, voronoiBorderVisible = false) {
    canvasColorPolygon(points, color, voronoiBorderVisible);
}

function drawElevationPolygons(voronoiBorderVisible) {
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= altitudeOcean) {
            colorPolygon(i, colorNatural(altitudeMax - sites[i].height), voronoiBorderVisible);
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

function drawElevationTriangles(voronoiBorderVisible) {
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
            colorTriangle(triangle, colorNatural(altitudeMax - heightAverage), voronoiBorderVisible);
        } else if (typeTriangle === 'Lake') {
            colorTriangle(triangle, '#3C8CBC');
        } else if (typeTriangle === 'Recif') {
            colorTriangle(triangle, '#646B9A');
        } else {
            colorTriangle(triangle, '#604E99');
        }
    }
}

function drawCoastLine() {
    coastLines.forEach((border) => {
        const startPoint = border.start.split(' ');
        const endPoint = border.end.split(' ');
        let color = '#000';
        let width = 1;

        if (border.typeCoastline === 'Ocean') {
            width = 2;
        } else {
            color = '#296F92';
        }
        canvasDrawLine(startPoint, endPoint, color, width);
    });
}

function styleMap() {
    const voronoiBorderVisible = document.getElementById('voronoiBorders').checked;
    if (document.getElementById('mapData').value === 'elevation') {
        if (document.getElementById('mapStyle').value === 'triangle') {
            drawElevationTriangles(voronoiBorderVisible);
        } else {
            drawElevationPolygons(voronoiBorderVisible);
        }
    } else if (document.getElementById('mapData').value === 'precipitation') {
        drawWeatherPolygons();
        drawPrecipitation();
    }
}

function showWorld() {
    clearScreen();
    styleMap();
    drawCoastLine();
    drawnRiver();
}


