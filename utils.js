import { worldState } from './world.js';
import { add, downcutCoastLine, resolveDepression, removeRedundant } from './heightmap.js';
import { initPrecipitation, generatePrecipitation, generateRiver } from './hydro.js';
import { generateBiomes } from './biomes.js';
import { generateFeatures } from './features.js';
import { showWorld } from './renderer/renderer.js';
import { contextCanvas } from './renderer/canvas.js';

function processWorld() {
    // Init
    initPrecipitation();
    // Generate Height
    downcutCoastLine();
    resolveDepression();

    generatePrecipitation();

    generateBiomes();
    // Generation Features + Coastline
    generateFeatures();

    generateRiver();
    // removeRedundant();
}

function moved() {
    const point = d3.mouse(this);
    const nearestId = worldState.delaunay.find(point[0], point[1]);

    d3.select('#coordX').text(point[0]);
    d3.select('#coordY').text(point[1]);

    d3.select('#cell').text(nearestId);
    d3.select('#high').text(worldState.sites[nearestId].height);
    if (worldState.sites[nearestId].type) {
        d3.select('#feature').text(worldState.sites[nearestId].description);
        d3.select('#number').text(worldState.sites[nearestId].featureID);
    } else {
        d3.select('#feature').text('Aucun signe distinctif');
        d3.select('#number').text('inconnue');
    }

    if (worldState.sites[nearestId].flux) {
        d3.select('#flux').text((worldState.sites[nearestId].flux).toFixed(2));
        d3.select('#precipitation').text((worldState.sites[nearestId].precipitation).toFixed(2));
    } else {
        d3.select('#flux').text('no!');
        d3.select('#precipitation').text('no!');
    }

    const river = worldState.hydro.riversData.find(function findRiver(element) {
        if (element.cell === nearestId) {
            return true;
        }
        return false;
    });
    if (river !== undefined) {
        d3.select('#riverType').text(river.type);
        d3.select('#river').text(river.river);
    } else {
        d3.select('#riverType').text('');
        d3.select('#river').text('');
    }

    if (worldState.sites[nearestId].temperatureDisplay) {
        d3.select('#temperature').text(worldState.sites[nearestId].temperatureDisplay);
    }

    if (worldState.sites[nearestId].biomeLabel) {
        d3.select('#biome').text(worldState.sites[nearestId].biomeLabel);
    } else {
        d3.select('#biome').text('no');
    }
}

function clicked() {
    const point = d3.mouse(this);
    const nearestId = worldState.delaunay.find(point[0], point[1]);

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

document.getElementById('voronoiBorders').onchange = changeMap;

function nextHalfedge(edge) {
    return (edge % 3 === 2) ? edge - 2 : edge + 1;
}

function prevHalfedge(edge) {
    return (edge % 3 === 0) ? edge + 2 : edge - 1;
}

function forEachTriangleEdge(callbackFunction) {
    for (let edge = 0; edge < worldState.delaunay.triangles.length; edge++) {
        if (edge > worldState.delaunay.halfedges[edge]) {
            const points = worldState.delaunay.points[worldState.delaunay.triangles[edge]];
            const otherPoints = worldState.delaunay.points[worldState.delaunay.triangles[nextHalfedge(edge)]];
            callbackFunction(edge, points, otherPoints);
        }
    }
}

function edgesOfTriangle(triangleID) {
    return [3 * triangleID, (3 * triangleID) + 1, (3 * triangleID) + 2];
}

function pointsOfTriangle(triangleID) {
    return edgesOfTriangle(triangleID)
        .map((edge) => worldState.delaunay.triangles[edge]);
}

function forEachTriangle(callbackFunction) {
    for (let triangleID = 0; triangleID < worldState.delaunay.triangles.length / 3; triangleID++) {
        callbackFunction(triangleID, pointsOfTriangle(triangleID).map((point) => [worldState.delaunay.points[point * 2], worldState.delaunay.points[(point * 2) + 1]]));
    }
}

function triangleOfEdge(edge) {
    return Math.floor(edge / 3);
}

function trianglesAdjacentToTriangle(triangle) {
    const adjacentTriangles = [];
    for (const edge of edgesOfTriangle(triangle)) {
        const opposite = worldState.delaunay.halfedges[edge];
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
        incoming = worldState.delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}

function getCommonPoints(polygonID, neighborPolygonID) {
    const polygon = worldState.voronoi.cellPolygon(polygonID);
    const polygonNeighbor = worldState.voronoi.cellPolygon(neighborPolygonID);
    const polygonPoints = [];
    const polygonNeighborPoints = [];
    let commonPoints = [];

    for (let i = 0; i < polygon.length - 1; i++) {
        polygonPoints.push(`${polygon[i][0]} ${polygon[i][1]}`);
    }
    commonPoints.push(polygonPoints);

    for (let i = 0; i < polygonNeighbor.length - 1; i++) {
        polygonNeighborPoints.push(`${polygonNeighbor[i][0]} ${polygonNeighbor[i][1]}`);
    }
    commonPoints.push(polygonNeighborPoints);

    commonPoints = commonPoints.shift().filter(function (v) {
        return commonPoints.every(function (a) {
            return a.indexOf(v) !== -1;
        });
    });

    return commonPoints;
}

function propagateNorth(neighborsIDArray) {
    let maxCoord = 0;
    let resultId = -1;

    for (let i = 0; i < neighborsIDArray.length; i++) {
        const neighborID = neighborsIDArray[i];
        const neighbor = worldState.sites[neighborID];


        if (neighbor[1] > maxCoord) {
            maxCoord = neighbor[1];
            resultId = neighborID;
        }
    }

    if (resultId >= 0) {
        return resultId;
    }

    return false;
}

function propagateEast(neighborsIDArray) {
    let minCoord = worldState.widthCanvas;
    let resultId = -1;

    for (let i = 0; i < neighborsIDArray.length; i++) {
        const neighborID = neighborsIDArray[i];
        const neighbor = worldState.sites[neighborID];

        if (neighbor[0] < minCoord) {
            minCoord = neighbor[0];
            resultId = neighborID;
        }
    }

    if (resultId >= 0) {
        return resultId;
    }

    return false;
}

function propagateSouth(neighborsIDArray) {
    let minCoord = worldState.heightCanvas;
    let resultId = -1;

    for (let i = 0; i < neighborsIDArray.length; i++) {
        const neighborID = neighborsIDArray[i];
        const neighbor = worldState.sites[neighborID];

        if (neighbor[1] < minCoord) {
            minCoord = neighbor[1];
            resultId = neighborID;
        }
    }

    if (resultId >= 0) {
        return resultId;
    }

    return false;
}

function propagateWest(neighborsIDArray) {
    let maxCoord = 0;
    let resultId = -1;

    for (let i = 0; i < neighborsIDArray.length; i++) {
        const neighborID = neighborsIDArray[i];
        const neighbor = worldState.sites[neighborID];

        if (neighbor[0] > maxCoord) {
            maxCoord = neighbor[0];
            resultId = neighborID;
        }
    }

    if (resultId >= 0) {
        return resultId;
    }

    return false;
}

function getNeighborsPolygons(polygonID, direction = 'north') {
    const neighborsID = [];

    for (const neighborID of worldState.delaunay.neighbors(polygonID)) {
        neighborsID.push(neighborID);
    }

    let result = polygonID;

    switch (direction) {
        case 'north':
            result = propagateNorth(neighborsID);
            break;
        case 'east':
            result = propagateEast(neighborsID);
            break;
        case 'south':
            result = propagateSouth(neighborsID);
            break;
        case 'west':
            result = propagateWest(neighborsID);
            break;
        default:
            break;
    }

    return result;
}

export { clicked, moved, getCommonPoints, getNeighborsPolygons, processWorld };
