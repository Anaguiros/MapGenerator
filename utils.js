function processWorld() {
    // Init
    initPrecipitation();
    // Generate Height
    downcutCoastLine();
    resolveDepression();
    // Generate Precipitation + rivers
    generatePrecipitation();
    generateRiver();
    // Generate Features + Coastline
    generateFeatures();
}

function moved() {
    const point = d3.mouse(this);
    const nearestId = delaunay.find(point[0], point[1]);

    d3.select('#coordX').text(point[0]);
    d3.select('#coordY').text(point[1]);

    d3.select('#cell').text(nearestId);
    d3.select('#high').text(sites[nearestId].height);
    if (sites[nearestId].type) {
        d3.select('#feature').text(sites[nearestId].description);
        d3.select('#number').text(sites[nearestId].number);
    } else {
        d3.select('#feature').text('Aucun signe distinctif');
        d3.select('#number').text('inconnue');
    }

    if (sites[nearestId].flux) {
        d3.select('#flux').text((sites[nearestId].flux).toFixed(2));
        d3.select('#precipitation').text((sites[nearestId].precipitation).toFixed(2));
    } else {
        d3.select('#flux').text('no!');
        d3.select('#precipitation').text('no!');
    }

    const river = riversData.find(function (element) {
        if (element.cell === nearestId) {
            return true;
        }
        return false;
    });
    if (river !== undefined) {
        d3.select('#riverType').text(river.type);
        d3.select('#river').text(river.river);
    }
}

function clicked() {
    const point = d3.mouse(this);
    const nearestId = delaunay.find(point[0], point[1]);

    add(nearestId, 'hill');
    processWorld();
    showWorld();
}

function zoom() {
    const transform = d3.event.transform;
    contextCanvas.save();
    clearCanvas();
    contextCanvas.translate(transform.x, transform.y);
    contextCanvas.scale(transform.k, transform.k);
    showWorld();
    contextCanvas.restore();
}

function changeMap(event) {
    showWorld();
}

document.getElementById('mapData').onchange = changeMap;

function nextHalfedge(edge) {
    return (edge % 3 === 2) ? edge - 2 : edge + 1;
}

function prevHalfedge(edge) {
    return (edge % 3 === 0) ? edge + 2 : edge - 1;
}

function forEachTriangleEdge(callbackFunction) {
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e > delaunay.halfedges[e]) {
            const p = delaunay.points[delaunay.triangles[e]];
            const q = delaunay.points[delaunay.triangles[nextHalfedge(e)]];
            callbackFunction(e, p, q);
        }
    }
}

function edgesOfTriangle(triangleID){ 
    return [3 * triangleID, 3 * triangleID + 1, 3 * triangleID + 2];
}

function pointsOfTriangle(triangleID) {
    return edgesOfTriangle(triangleID)
        .map(e => delaunay.triangles[e]);
}

function forEachTriangle(callback) {
    for (let triangleID = 0; triangleID < delaunay.triangles.length / 3; triangleID++) {
        callback(triangleID, pointsOfTriangle(triangleID).map(p => [delaunay.points[p*2],delaunay.points[p*2+1]]));
    }
}

function triangleOfEdge(e){
    return Math.floor(e / 3);
}

function trianglesAdjacentToTriangle(t) {
    const adjacentTriangles = [];
    for (const e of edgesOfTriangle(t)) {
        const opposite = delaunay.halfedges[e];
        if (opposite >= 0) {
            adjacentTriangles.push(triangleOfEdge(opposite));
        }
    }
    return adjacentTriangles;
}

function edgesAroundPoint(start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}

function getCommonPoints(polygonID, neighborPolygonID) {
    const polygon = voronoi.cellPolygon(polygonID);
    const polygonNeighbor = voronoi.cellPolygon(neighborPolygonID);
    const polygonPoints = [];
    const polygonNeighborPoints = [];
    let commonPoints = [];

    for (let i = 0; i < polygon.length - 1; i++) {
        polygonPoints.push(polygon[i][0] + ' ' + polygon[i][1]);
    }
    commonPoints.push(polygonPoints);

    for (let i = 0; i < polygonNeighbor.length - 1; i++) {
        polygonNeighborPoints.push(polygonNeighbor[i][0] + ' ' + polygonNeighbor[i][1]);
    }
    commonPoints.push(polygonNeighborPoints);

    commonPoints = commonPoints.shift().filter(function (v) {
        return commonPoints.every(function (a) {
            return a.indexOf(v) !== -1;
        });
    });

    return commonPoints;
}

function fade(id) {
    const element = document.getElementById(id);
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

function drawCircle(x, y, radius, colorFill, colorStroke) {
    if (typeof colorStroke === 'undefined') {
        colorStroke = colorFill;
    }

    contextCanvas.beginPath();
    contextCanvas.arc(x, y, radius, 0, 2 * Math.PI, false);
    contextCanvas.fillStyle = colorFill;
    contextCanvas.fill();
    contextCanvas.lineWidth = 1;
    contextCanvas.strokeStyle = colorStroke;
    contextCanvas.stroke();
}
