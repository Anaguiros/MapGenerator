
import { worldState } from './world';

const north = document.getElementById('north');
const east = document.getElementById('east');
const south = document.getElementById('south');
const west = document.getElementById('west');

let windsBuffer;
let raining;

let riversData;
let riverID;
let riversOrder;
let confluence;

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
    }
}

function generateNorth(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let x = -1;
    let y = -1;
    let precipitation = 0;
    let nearestID = 0;
    let height = 0;
    let rain = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][1] < selection && worldState.sites[i][0] > worldState.widthCanvas * 0.1 && worldState.sites[i][0] < worldState.widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = worldState.sites[startPolygonID][0];
        y = worldState.sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (y < worldState.heightCanvas && precipitation > 0) {
            y += 5;
            x += (Math.random() * 10) - 5;
            nearestID = worldState.delaunay.find(x, y);
            height = worldState.sites[nearestID].height;
            if (height >= worldState.altitudeOcean) {
                if (height < worldState.altitudePeak) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    worldState.sites[nearestID].precipitation += rain;
                } else {
                    worldState.sites[nearestID].precipitation += precipitation;
                    precipitation = 0;
                }
                localRaining.push([ x, y ]);
            }
        }
    });
    return localRaining;
}

function generateEast(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let x = -1;
    let y = -1;
    let precipitation = 0;
    let nearestID = 0;
    let height = 0;
    let rain = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][0] > worldState.widthCanvas - selection && worldState.sites[i][1] > worldState.heightCanvas * 0.1 && worldState.sites[i][1] < worldState.heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = worldState.sites[startPolygonID][0];
        y = worldState.sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (x > 0 && precipitation > 0) {
            x -= 5;
            y += (Math.random() * 10) - 5;
            nearestID = worldState.delaunay.find(x, y);
            height = worldState.sites[nearestID].height;
            if (height >= worldState.altitudeOcean) {
                if (height < worldState.altitudePeak) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    worldState.sites[nearestID].precipitation += rain;
                } else {
                    worldState.sites[nearestID].precipitation += precipitation;
                    precipitation = 0;
                }
                localRaining.push([ x, y ]);
            }
        }
    });
    return localRaining;
}

function generateSouth(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let x = -1;
    let y = -1;
    let precipitation = 0;
    let nearestID = 0;
    let height = 0;
    let rain = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][1] > worldState.heightCanvas - selection && worldState.sites[i][0] > worldState.widthCanvas * 0.1 && worldState.sites[i][0] < worldState.widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = worldState.sites[startPolygonID][0];
        y = worldState.sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (y > 0 && precipitation > 0) {
            y -= 5;
            x += (Math.random() * 10) - 5;
            nearestID = worldState.delaunay.find(x, y);
            height = worldState.sites[nearestID].height;
            if (height >= worldState.altitudeOcean) {
                if (height < worldState.altitudePeak) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    worldState.sites[nearestID].precipitation += rain;
                } else {
                    worldState.sites[nearestID].precipitation += precipitation;
                    precipitation = 0;
                }
                localRaining.push([ x, y ]);
            }
        }
    });
    return localRaining;
}

function generateWest(selection, precipInit) {
    const frontier = [];
    const localRaining = [];
    let x = -1;
    let y = -1;
    let precipitation = 0;
    let nearestID = 0;
    let height = 0;
    let rain = 0;

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i][0] < selection && worldState.sites[i][1] > worldState.heightCanvas * 0.1 && worldState.sites[i][1] < worldState.heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = worldState.sites[startPolygonID][0];
        y = worldState.sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (x < worldState.widthCanvas && precipitation > 0) {
            x += 5;
            y += (Math.random() * 10) - 5;
            nearestID = worldState.delaunay.find(x, y);
            height = worldState.sites[nearestID].height;
            if (height >= worldState.altitudeOcean) {
                if (height < worldState.altitudePeak) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    worldState.sites[nearestID].precipitation += rain;
                } else {
                    worldState.sites[nearestID].precipitation += precipitation;
                    precipitation = 0;
                }
                localRaining.push([ x, y ]);
            }
        }
    });
    return localRaining;
}

function generatePrecipitation() {
    windsBuffer = [];
    raining = [];

    if (randomWinds.checked) {
        randomizeWinds();
    }

    let sides = north.checked + east.checked + south.checked + west.checked;

    if (sides === 0) {
        sides = 1;
        randomizeWindsDefault();
    }

    const precipInit = precipitationInput.value / Math.sqrt(sides);
    const selection = 30 / sides;

    if (north.checked) {
        raining.concat(generateNorth(selection, precipInit));
    }
    if (east.checked) {
        raining.concat(generateEast(selection, precipInit));
    }
    if (south.checked) {
        raining.concat(generateSouth(selection, precipInit));
    }
    if (west.checked) {
        raining.concat(generateWest(selection, precipInit));
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
    riversData = [];
    riverID = 0;
    riversOrder = [];
    confluence = [];

    for (let i = 0; i < landPolygonID.length; i++) {
        const neighborsPolygons = [];
        const aval = [];
        const sommetsLocaux = [];
        const idCellLand = landPolygonID[i];
        let xDiff;
        let yDiff;

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
                worldState.sites[idCellLand].river = riverID;
                riverID++;
                riversOrder.push({ river: worldState.sites[idCellLand].river, order: Math.random / 1000 });
                riversData.push({
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
                const iRiver = riversData.filter((element) => element.river === worldState.sites[idCellLand].river);
                const minRiver = riversData.filter((element) => element.river === riverTo);
                let iRiverLength = iRiver.length;
                let minRiverLength = minRiver.length;

                if (iRiverLength >= minRiverLength) {
                    riversOrder[worldState.sites[idCellLand].river].order += iRiverLength;
                    worldState.sites[localMinID].river = worldState.sites[idCellLand].river;
                    iRiverLength++;
                    minRiverLength--;
                } else if (!riversOrder[riverTo]) {
                    console.error('Order error');
                    riversOrder[riverTo] = [];
                    riversOrder[riverTo].order = minRiverLength;
                } else {
                    riversOrder[riverTo].order += minRiverLength;
                }

                // Marque Confluence
                if (worldState.sites[localMinID].height >= worldState.altitudeOcean && iRiverLength > 1 && minRiverLength > 1) {
                    if (iRiverLength >= minRiverLength) {
                        confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: worldState.sites[idCellLand].river });
                    }
                    if (!worldState.sites[localMinID].confluence) {
                        worldState.sites[localMinID].confluence = 2;
                        let cellTo = minRiver[minRiverLength - 1].cell;
                        if (cellTo === localMinID) {
                            cellTo = minRiver[minRiverLength - 2].cell;
                        }
                        confluence.push({ id: localMinID, start: cellTo, length: minRiverLength - 1, river: riverTo });
                    } else {
                        worldState.sites[localMinID].confluence++;
                    }
                    if (iRiverLength < minRiverLength) {
                        confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: worldState.sites[idCellLand].river });
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
                            riversData.push({
                                river: worldState.sites[idCellLand].river,
                                cell: idCellLand,
                                x: aval[0].x,
                                y: aval[0].y,
                                type: 'delta',
                                aval: aval[0].cell,
                            });
                        } else {
                            riversData.push({
                                river: riverID,
                                cell: idCellLand,
                                x: worldState.sites[idCellLand][0],
                                y: worldState.sites[idCellLand][1],
                                type: 'course',
                            });
                            riversData.push({
                                river: riverID,
                                cell: idCellLand,
                                x: aval[c].x,
                                y: aval[c].y,
                                type: 'delta',
                            });
                            riverID++;
                        }
                    }
                } else {
                    // Estuaire de la riviere
                    const x = aval[0].x + ((aval[0].x - worldState.sites[idCellLand][0]) / 10);
                    const y = aval[0].y + ((aval[0].y - worldState.sites[idCellLand][1]) / 10);
                    riversData.push({
                        river: worldState.sites[idCellLand].river,
                        cell: idCellLand,
                        x: x,
                        y: y,
                        type: 'estuary',
                        aval: aval[0].cell,
                    });
                }
            } else {
                // Segment de la rivière
                riversData.push({
                    river: worldState.sites[idCellLand].river,
                    cell: localMinID,
                    x: worldState.sites[localMinID][0],
                    y: worldState.sites[localMinID][1],
                    type: 'course',
                });
            }
        }
    }

    riversOrder.sort(function sortRiverOrder(riverA, riverB) {
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
