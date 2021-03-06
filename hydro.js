import { worldState } from './world.js';
import { widthCanvas, heightCanvas } from './renderer/canvas.js';
import { getNeighborsPolygons } from './utils.js';

const north = document.getElementById('north');
const east = document.getElementById('east');
const south = document.getElementById('south');
const west = document.getElementById('west');

function randomizeWinds() {
    north.checked = Math.random() >= 0.75;
    east.checked = Math.random() >= 0.75;
    south.checked = Math.random() >= 0.75;
    west.checked = Math.random() >= 0.75;
}

function randomizeWindsDefault() {
    const side = Math.random();
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

function initPrecipitation() {
    for (let i = 0; i < worldState.sites.length; i++) {
        worldState.sites[i].precipitation = 0.01;
        worldState.sites[i].flux = 0.01;

        if (worldState.sites[i].type === 'Island') {
            delete worldState.sites[i].river;
        }
    }
}

function rainfall(polygonID, precipitation, localRaining) {
    const height = worldState.sites[polygonID].height;
    if (height >= worldState.altitudeOcean) {
        if (height < worldState.altitudePeak) {
            const rain = Math.random() * height;
            precipitation -= rain;
            worldState.sites[polygonID].precipitation += rain;
        } else {
            worldState.sites[polygonID].precipitation += precipitation;
            precipitation = 0;
        }
        localRaining.push([ worldState.sites[polygonID][0], worldState.sites[polygonID][1] ]);
    }
    return precipitation;
}

function generateNorth(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let precipitation = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][1] < selection && worldState.sites[i][0] > worldState.widthCanvas * 0.1 && worldState.sites[i][0] < worldState.widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        precipitation = precipInit;

        let currentPolygon = startPolygonID;

        worldState.hydro.windsBuffer.push([ worldState.sites[startPolygonID][0], worldState.sites[startPolygonID][1] ]);

        while (worldState.sites[currentPolygon][1] < (worldState.heightCanvas * 0.9) && precipitation > 0) {
            currentPolygon = getNeighborsPolygons(currentPolygon, 'north');
            precipitation = rainfall(currentPolygon, precipitation, localRaining);
        }
    });
    return localRaining;
}

function generateEast(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let precipitation = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][0] > worldState.widthCanvas - selection && worldState.sites[i][1] > worldState.heightCanvas * 0.1 && worldState.sites[i][1] < worldState.heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        precipitation = precipInit;

        let currentPolygon = startPolygonID;

        worldState.hydro.windsBuffer.push([ worldState.sites[startPolygonID][0], worldState.sites[startPolygonID][1] ]);

        while (worldState.sites[currentPolygon][0] > (worldState.widthCanvas * 0.1) && precipitation > 0) {
            currentPolygon = getNeighborsPolygons(currentPolygon, 'east');
            precipitation = rainfall(currentPolygon, precipitation, localRaining);
        }
    });
    return localRaining;
}

function generateSouth(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let precipitation = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][1] > worldState.heightCanvas - selection && worldState.sites[i][0] > worldState.widthCanvas * 0.1 && worldState.sites[i][0] < worldState.widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        precipitation = precipInit;

        let currentPolygon = startPolygonID;

        worldState.hydro.windsBuffer.push([ worldState.sites[startPolygonID][0], worldState.sites[startPolygonID][1] ]);

        while (worldState.sites[currentPolygon][1] > (worldState.heightCanvas * 0.1) && precipitation > 0) {
            currentPolygon = getNeighborsPolygons(currentPolygon, 'south');
            precipitation = rainfall(currentPolygon, precipitation, localRaining);
        }
    });
    return localRaining;
}

function generateWest(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let precipitation = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][0] < selection && worldState.sites[i][1] > worldState.heightCanvas * 0.1 && worldState.sites[i][1] < worldState.heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        precipitation = precipInit;

        let currentPolygon = startPolygonID;

        worldState.hydro.windsBuffer.push([ worldState.sites[startPolygonID][0], worldState.sites[startPolygonID][1] ]);

        while (worldState.sites[currentPolygon][0] < (worldState.widthCanvas * 0.9) && precipitation > 0) {
            currentPolygon = getNeighborsPolygons(currentPolygon, 'west');
            precipitation = rainfall(currentPolygon, precipitation, localRaining);
        }
    });
    return localRaining;
}

function generatePrecipitation() {
    worldState.hydro.windsBuffer = [];
    worldState.hydro.raining = [];

    if (randomWinds.checked) {
        randomizeWinds();
    }

    let sides = north.checked + east.checked + south.checked + west.checked;

    if (sides === 0) {
        sides = 1;
        randomizeWindsDefault();
    }

    const precipInit = precipitationInput.value;// / Math.sqrt(sides);
    const selection = 30 / sides;

    if (north.checked) {
        worldState.hydro.raining = worldState.hydro.raining.concat(generateNorth(selection, precipInit));
    }
    if (east.checked) {
        worldState.hydro.raining = worldState.hydro.raining.concat(generateEast(selection, precipInit));
    }
    if (south.checked) {
        worldState.hydro.raining = worldState.hydro.raining.concat(generateSouth(selection, precipInit));
    }
    if (west.checked) {
        worldState.hydro.raining = worldState.hydro.raining.concat(generateWest(selection, precipInit));
    }

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= worldState.altitudeOcean) {
            const precipMoyenne = [ worldState.sites[i].precipitation ];
            for (const neighborID of worldState.delaunay.neighbors(i)) {
                precipMoyenne.push(worldState.sites[neighborID].precipitation);
            }
            const moyenne = d3.mean(precipMoyenne);
            worldState.sites[i].precipitation = moyenne;
            worldState.sites[i].flux = moyenne;
        }
    }
}

function generateRiver() {
    worldState.hydro.riversData = [];
    worldState.hydro.riverID = 0;
    worldState.hydro.riversOrder = [];
    worldState.hydro.confluence = [];

    for (let i = 0; i < worldState.landPolygonID.length; i++) {
        const neighborsPolygons = [];
        const aval = [];
        const sommetsLocaux = [];
        const idCellLand = worldState.landPolygonID[i];
        let xDiff = 0;
        let yDiff = 0;

        for (const neighborID of worldState.delaunay.neighbors(idCellLand)) {
            neighborsPolygons.push(neighborID);
            sommetsLocaux.push(worldState.sites[neighborID].height);
            if (worldState.sites[neighborID].height < worldState.altitudeOcean) {
                xDiff = (worldState.sites[idCellLand][0] + worldState.sites[neighborID][0]) / 2;
                yDiff = (worldState.sites[idCellLand][1] + worldState.sites[neighborID][1]) / 2;
                aval.push({
                    x: xDiff,
                    y: yDiff,
                    cell: neighborID,
                });
            }
        }

        const localMinID = neighborsPolygons[sommetsLocaux.indexOf(Math.min(...sommetsLocaux))];

        if (worldState.sites[idCellLand].flux > 0.85) {
            if (!worldState.sites[idCellLand].river) {
                // Nouvelle river
                worldState.sites[idCellLand].river = worldState.hydro.riverID;
                worldState.hydro.riverID++;
                worldState.hydro.riversOrder.push({ river: worldState.sites[idCellLand].river, order: Math.random / 1000 });
                worldState.hydro.riversData.push({
                    river: worldState.sites[idCellLand].river,
                    cell: idCellLand,
                    x: worldState.sites[idCellLand][0],
                    y: worldState.sites[idCellLand][1],
                    type: 'source',
                });
            }

            if (!worldState.sites[localMinID].river) {
                // On ajoute la river en cours à la cellule aval si elle ne possède pas déjà de river
                worldState.sites[localMinID].river = worldState.sites[idCellLand].river;
            } else {
                const riverTo = worldState.sites[localMinID].river;
                const iRiver = worldState.hydro.riversData.filter((element) => element.river === worldState.sites[idCellLand].river);
                const minRiver = worldState.hydro.riversData.filter((element) => element.river === riverTo);
                let iRiverLength = iRiver.length;
                let minRiverLength = minRiver.length;

                if (iRiverLength >= minRiverLength) {
                    worldState.hydro.riversOrder[worldState.sites[idCellLand].river].order += iRiverLength;
                    worldState.sites[localMinID].river = worldState.sites[idCellLand].river;
                    iRiverLength++;
                    minRiverLength--;
                } else if (!worldState.hydro.riversOrder[riverTo]) {
                    console.error('Order error');
                    worldState.hydro.riversOrder[riverTo] = [];
                    worldState.hydro.riversOrder[riverTo].order = minRiverLength;
                } else {
                    worldState.hydro.riversOrder[riverTo].order += minRiverLength;
                }

                // Marque Confluence
                if (worldState.sites[localMinID].height >= worldState.altitudeOcean && iRiverLength > 1 && minRiverLength > 1) {
                    if (iRiverLength >= minRiverLength) {
                        worldState.hydro.confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: worldState.sites[idCellLand].river });
                    }
                    if (!worldState.sites[localMinID].confluence) {
                        worldState.sites[localMinID].confluence = 2;
                        let cellTo = minRiver[minRiverLength - 1].cell;
                        if (cellTo === localMinID) {
                            cellTo = minRiver[minRiverLength - 2].cell;
                        }
                        worldState.hydro.confluence.push({ id: localMinID, start: cellTo, length: minRiverLength - 1, river: riverTo });
                    } else {
                        worldState.sites[localMinID].confluence++;
                    }
                    if (iRiverLength < minRiverLength) {
                        worldState.hydro.confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: worldState.sites[idCellLand].river });
                    }
                }
            }
        }

        worldState.sites[localMinID].flux += worldState.sites[idCellLand].flux;
        if (worldState.sites[idCellLand].precipitation * 0.97 > worldState.sites[localMinID].precipitation) {
            worldState.sites[localMinID].precipitation = worldState.sites[idCellLand].precipitation * 0.97;
        }

        if (worldState.sites[idCellLand].river) {
            if (worldState.sites[localMinID].height < worldState.altitudeOcean) {
                // Deverse riviere dans ocean
                if (worldState.sites[idCellLand].flux > 14 && aval.length > 1 && !worldState.sites[idCellLand].confluence) {
                    for (let c = 0; c < aval.length; c++) {
                        if (c === 0) {
                            worldState.hydro.riversData.push({
                                river: worldState.sites[idCellLand].river,
                                cell: idCellLand,
                                x: aval[0].x,
                                y: aval[0].y,
                                type: 'delta',
                                aval: aval[0].cell,
                            });
                        } else {
                            worldState.hydro.riversData.push({
                                river: worldState.hydro.riverID,
                                cell: idCellLand,
                                x: worldState.sites[idCellLand][0],
                                y: worldState.sites[idCellLand][1],
                                type: 'course',
                            });
                            worldState.hydro.riversData.push({
                                river: worldState.hydro.riverID,
                                cell: idCellLand,
                                x: aval[c].x,
                                y: aval[c].y,
                                type: 'delta',
                            });
                            worldState.hydro.riverID++;
                        }
                    }
                } else {
                    // Estuaire de la riviere
                    const x = aval[0].x + ((aval[0].x - worldState.sites[idCellLand][0]) / 10);
                    const y = aval[0].y + ((aval[0].y - worldState.sites[idCellLand][1]) / 10);
                    worldState.hydro.riversData.push({
                        river: worldState.sites[idCellLand].river,
                        cell: idCellLand,
                        x,
                        y,
                        type: 'estuary',
                        aval: aval[0].cell,
                    });
                }
            } else {
                // Segment de la rivière
                worldState.hydro.riversData.push({
                    river: worldState.sites[idCellLand].river,
                    cell: localMinID,
                    x: worldState.sites[localMinID][0],
                    y: worldState.sites[localMinID][1],
                    type: 'course',
                });
            }
        }
    }

    worldState.hydro.riversOrder.sort(function sortRiverOrder(riverA, riverB) {
        if (riverA.order < riverB.order) {
            return 1;
        } else if (riverA.order > riverB.order) {
            return -1;
        }
        return 0;
    });
}

// Export - Functions
export { initPrecipitation, generatePrecipitation, generateRiver };
