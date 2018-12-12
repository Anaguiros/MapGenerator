/* global delaunay sites highInput radiusInput sharpnessInput downcuttingInput contextCanvas*/
let lines = null;
let landPolygonID = [];

const altitudeOcean = 0.2;
const altitudePeak = 0.6;
const altitudeMax = 1;

function initHeights() {
    for (let i = 0; i < sites.length; i++) {
        sites[i].height = 0;
    }
}

function add(polygonStartID, type) {
    const explorationQueue = [];
    const exploredPolygon = new Array(sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = false;
    }

    let height = highInput.valueAsNumber;
    const radius = radiusInput.valueAsNumber;
    const sharpness = sharpnessInput.valueAsNumber;

    sites[polygonStartID].height += height;
    exploredPolygon[polygonStartID] = true;
    explorationQueue.push(polygonStartID);
    for (let i = 0; i < explorationQueue.length && height > 0.01; i++) {
        if (type === 'island') {
            height = (sites[explorationQueue[i]].height * radius) - (height / 100);
        } else {
            height *= radius;
        }
        for (const neighborID of delaunay.neighbors(explorationQueue[i])) {
            if (!exploredPolygon[neighborID]) {
                let noise = (Math.random() * sharpness) + 1.1 - sharpness;
                if (sharpness === 0) {
                    noise = 1;
                }
                sites[neighborID].height += height * noise;
                if (sites[neighborID].height > altitudeMax) {
                    sites[neighborID].height = altitudeMax;
                }
                exploredPolygon[neighborID] = true;
                explorationQueue.push(neighborID);
            }
        }
    }
}

function downcutCoastLine() {
    const downcut = downcuttingInput.valueAsNumber;
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= altitudeOcean) {
            sites[i].height -= downcut;
        }
    }
}

function drawCoastLine() {
    lines.forEach((border) => {
        const startPoint = border.start.split(' ');
        const endPoint = border.end.split(' ');

        contextCanvas.beginPath();
        contextCanvas.moveTo(startPoint[0], startPoint[1]);
        contextCanvas.lineTo(endPoint[0], endPoint[1]);
        contextCanvas.closePath();
        if (border.typeCoastline === 'Ocean') {
            contextCanvas.strokeStyle = '#000';
            contextCanvas.lineWidth = 2;
        } else {
            contextCanvas.strokeStyle = '#296F92';
        }
        contextCanvas.stroke();
    });
}

function resolveDepression() {
    landPolygonID = [];
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= altitudeOcean) {
            landPolygonID.push(i);
        }
    }

    let depression = 1;
    let minCell = -1;
    let minHigh = 0;

    while (depression > 0) {
        depression = 0;
        for (let i = 0; i < landPolygonID.length; i++) {
            minHigh = 10;
            for (const neighborID of delaunay.neighbors(landPolygonID[i])) {
                if (sites[neighborID].height < minHigh) {
                    minHigh = sites[neighborID].height;
                    minCell = neighborID;
                }
            }
            if (sites[landPolygonID[i]].height <= sites[minCell].height) {
                depression += 1;
                sites[landPolygonID[i]].height = sites[minCell].height + 0.01;
            }
        }
    }
    landPolygonID.sort(function sortheight(cellA, cellB) {
        if (sites[cellA].height < sites[cellB].height) {
            return 1;
        } else if (sites[cellA].height > sites[cellB].height) {
            return -1;
        }
        return 0;
    });
}
