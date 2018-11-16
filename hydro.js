/* globals document d3 delaunay*/
/* globals sites widthCanvas heightCanvas*/

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
    for (let i = 0; i < sites.length; i++) {
        sites[i].precipitation = 0.01;
        sites[i].flux = 0.01;
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

    for (let i = 0; i < sites.length; i++) {
        if (sites[i][1] < selection && sites[i][0] > widthCanvas * 0.1 && sites[i][0] < widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = sites[startPolygonID][0];
        y = sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (y < heightCanvas && precipitation > 0) {
            y += 5;
            x += (Math.random() * 10) - 5;
            nearestID = delaunay.find(x, y);
            height = sites[nearestID].height;
            if (height >= 0.2) {
                if (height < 0.6) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    sites[nearestID].precipitation += rain;
                } else {
                    sites[nearestID].precipitation += precipitation;
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

    for (let i = 0; i < sites.length; i++) {
        if (sites[i][0] > widthCanvas - selection && sites[i][1] > heightCanvas * 0.1 && sites[i][1] < heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = sites[startPolygonID][0];
        y = sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (x > 0 && precipitation > 0) {
            x -= 5;
            y += (Math.random() * 10) - 5;
            nearestID = delaunay.find(x, y);
            height = sites[nearestID].height;
            if (height >= 0.2) {
                if (height < 0.6) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    sites[nearestID].precipitation += rain;
                } else {
                    sites[nearestID].precipitation += precipitation;
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

    for (let i = 0; i < sites.length; i++) {
        if (sites[i][1] > heightCanvas - selection && sites[i][0] > widthCanvas * 0.1 && sites[i][0] < widthCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = sites[startPolygonID][0];
        y = sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (y > 0 && precipitation > 0) {
            y -= 5;
            x += (Math.random() * 10) - 5;
            nearestID = delaunay.find(x, y);
            height = sites[nearestID].height;
            if (height >= 0.2) {
                if (height < 0.6) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    sites[nearestID].precipitation += rain;
                } else {
                    sites[nearestID].precipitation += precipitation;
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

    for (let i = 0; i < sites.length; i++) {
        if (sites[i][0] < selection && sites[i][1] > heightCanvas * 0.1 && sites[i][1] < heightCanvas * 0.9) {
            frontier.push(i);
        }
    }
    frontier.forEach((startPolygonID) => {
        x = sites[startPolygonID][0];
        y = sites[startPolygonID][1];
        precipitation = precipInit;

        windsBuffer.push([ x, y ]);

        while (x < widthCanvas && precipitation > 0) {
            x += 5;
            y += (Math.random() * 10) - 5;
            nearestID = delaunay.find(x, y);
            height = sites[nearestID].height;
            if (height >= 0.2) {
                if (height < 0.6) {
                    rain = Math.random() * height;
                    precipitation -= rain;
                    sites[nearestID].precipitation += rain;
                } else {
                    sites[nearestID].precipitation += precipitation;
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

    for (let i = 0; i < sites.length; i++) {
        if (sites[i].height >= 0.2) {
            const precipMoyenne = [ sites[i].precipitation ];
            for (const neighborID of delaunay.neighbors(i)) {
                precipMoyenne.push(sites[neighborID].precipitation);
            }
            const moyenne = d3.mean(precipMoyenne);
            sites[i].precipitation = moyenne;
            sites[i].flux = moyenne;
        }
    }
}

function drawPrecipitation() {
    windsBuffer.forEach((wind) => {
        drawCircle(wind[0], wind[1], 1, 'white');
    });

    raining.forEach((rain) => {
        drawCircle(rain[0], rain[1], 0.3, 'blue');
    });
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

        for (const neighborID of delaunay.neighbors(idCellLand)) {
            neighborsPolygons.push(neighborID);
            sommetsLocaux.push(sites[neighborID].height);
            if (sites[neighborID].height < 0.2) {
                xDiff = (sites[idCellLand][0] + sites[neighborID][0]) / 2;
                yDiff = (sites[idCellLand][1] + sites[neighborID][1]) / 2;
                aval.push({
                    x: xDiff,
                    y: yDiff,
                    cell: neighborID,
                });
            }
        }

        const localMinID = neighborsPolygons[sommetsLocaux.indexOf(Math.min(...sommetsLocaux))];

        if (sites[idCellLand].flux > 0.85) {
            if (!sites[idCellLand].river) {
                // Nouvelle river
                sites[idCellLand].river = riverID;
                riverID++;
                riversOrder.push({ river: sites[idCellLand].river, order: Math.random / 1000 });
                riversData.push({
                    river: sites[idCellLand].river,
                    cell: idCellLand,
                    x: sites[idCellLand][0],
                    y: sites[idCellLand][1],
                    type: 'source',
                });
            }

            if (!sites[localMinID].river) {
                // On ajoute la river en cours à la cellule aval si elle ne possède pas déjà de river
                sites[localMinID].river = sites[idCellLand].river;
            } else {
                const riverTo = sites[localMinID].river;
                const iRiver = riversData.filter((element) => element.river === sites[idCellLand].river);
                const minRiver = riversData.filter((element) => element.river === riverTo);
                let iRiverLength = iRiver.length;
                let minRiverLength = minRiver.length;

                if (iRiverLength >= minRiverLength) {
                    riversOrder[sites[idCellLand].river].order += iRiverLength;
                    sites[localMinID].river = sites[idCellLand].river;
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
                if (sites[localMinID].height >= 0.2 && iRiverLength > 1 && minRiverLength > 1) {
                    if (iRiverLength >= minRiverLength) {
                        confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: sites[idCellLand].river });
                    }
                    if (!sites[localMinID].confluence) {
                        sites[localMinID].confluence = 2;
                        let cellTo = minRiver[minRiverLength - 1].cell;
                        if (cellTo === localMinID) {
                            cellTo = minRiver[minRiverLength - 2].cell;
                        }
                        confluence.push({ id: localMinID, start: cellTo, length: minRiverLength - 1, river: riverTo });
                    } else {
                        sites[localMinID].confluence++;
                    }
                    if (iRiverLength < minRiverLength) {
                        confluence.push({ id: localMinID, start: idCellLand, length: iRiverLength, river: sites[idCellLand].river });
                    }
                }
            }
        }

        sites[localMinID].flux += sites[idCellLand].flux;
        if (sites[idCellLand].precipitation * 0.97 > sites[localMinID].precipitation) {
            sites[localMinID].precipitation = sites[idCellLand].precipitation * 0.97;
        }

        if (sites[idCellLand].river) {
            if (sites[localMinID].height < 0.2) {
                // Deverse riviere dans ocean
                if (sites[idCellLand].flux > 14 && aval.length > 1 && !sites[idCellLand].confluence) {
                    for (let c = 0; c < aval.length; c++) {
                        if (c === 0) {
                            riversData.push({
                                river: sites[idCellLand].river,
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
                                x: sites[idCellLand][0],
                                y: sites[idCellLand][1],
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
                    const x = aval[0].x + ((aval[0].x - sites[idCellLand][0]) / 10);
                    const y = aval[0].y + ((aval[0].y - sites[idCellLand][1]) / 10);
                    riversData.push({
                        river: sites[idCellLand].river,
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
                    river: sites[idCellLand].river,
                    cell: localMinID,
                    x: sites[localMinID][0],
                    y: sites[localMinID][1],
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

function drawnRiver() {
    const line = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .curve(d3.curveCatmullRom.alpha(0.1))
        .context(contextCanvas);

    const confAngles = [];
    let side = 1;

    // DEBUG COLORATION
    /* for (let i = 0; i < riversData.length; i++) {
        if(riversData[i].type == 'delta'){
            colorPolygon(riversData[i].cell, '#F00');
        } else if(riversData[i].type == 'estuary'){
            colorPolygon(riversData[i].cell, '#00F');
        } else if(riversData[i].type == 'source'){
            colorPolygon(riversData[i].cell, '#0F0');
        }
    }*/

    for (let i = 0; i < riversOrder.length; i++) {
        const dataRiver = riversData.filter((element) => element.river === riversOrder[i].river);

        if (dataRiver.length > 1) {
            const riverAmended = [];
            if (dataRiver.length > 2 || dataRiver[1].type === 'delta') {
                // Découpage du segment en tiers
                for (let river = 0; river < dataRiver.length; river++) {
                    const dX = dataRiver[river].x;
                    const dY = dataRiver[river].y;
                    riverAmended.push({ x: dX, y: dY });
                    if (river + 1 < dataRiver.length) {
                        const eX = dataRiver[river + 1].x;
                        const eY = dataRiver[river + 1].y;
                        const angle = Math.atan2(eY - dY, eX - dX);
                        if (dataRiver[river + 1].type === 'course') {
                            const mean = (sizeInput.valueAsNumber / 10) + (Math.random() * (sizeInput.valueAsNumber / 10));
                            let firstThirdX = ((dX * 2) + eX) / 3;
                            let firstThirdY = ((dY * 2) + eY) / 3;
                            let secondThirdX = (dX + (eX * 2)) / 3;
                            let secondThirdY = (dY + (eY * 2)) / 3;

                            if (Math.random() > 0.5) {
                                side *= -1;
                            }
                            firstThirdX += -Math.sin(angle) * mean * side;
                            firstThirdY += Math.cos(angle) * mean * side;
                            if (Math.random() > 0.6) {
                                side *= -1;
                            }
                            secondThirdX += Math.sin(angle) * mean * side;
                            secondThirdY += -Math.cos(angle) * mean * side;
                            riverAmended.push({ x: firstThirdX, y: firstThirdY });
                            riverAmended.push({ x: secondThirdX, y: secondThirdY });
                        } else {
                            const mean = (sizeInput.valueAsNumber / 20) + (Math.random() * (sizeInput.valueAsNumber / 20));
                            let middleX = (dX + eX) / 2;
                            let middleY = (dY + eY) / 2;
                            middleX += -Math.sin(angle) * mean * side;
                            middleY += Math.cos(angle) * mean * side;
                            riverAmended.push({ x: middleX, y: middleY });
                        }
                    }
                }
            }
            // Dessin line river
            if (dataRiver[1].type === 'delta') {
                contextCanvas.beginPath();
                line(riverAmended);
                contextCanvas.lineWidth = 0.6;
                contextCanvas.strokeStyle = 'steelblue';
                contextCanvas.stroke();
            } else {
                let count = 1;
                let width = 0;
                for (let s = 0; s < riverAmended.length / 3; s++) {
                    let start;
                    let middle;
                    let end;
                    let next;

                    if (s === Math.floor(riverAmended.length / 3)) {
                        start = riverAmended[(s * 3) - 1];
                        end = riverAmended[s * 3];
                    } else {
                        start = riverAmended[s * 3];
                        middle = riverAmended[(s * 3) + 1];
                        end = riverAmended[(s * 3) + 2];
                        if (s !== riverAmended.length / 3) {
                            next = riverAmended[(s * 3) + 3];
                        }
                    }

                    const cellDestinationID = delaunay.find(end.x, end.y);
                    let xNode = end.x;
                    let yNode = end.y;
                    // let riverWidth = ((count + width) * 3) / (50 - sizeInput.valueAsNumber * 2);
                    let riverWidth = Math.sqrt((count + width));
                    count++;
                    /* if(cellDestinationID){
                        if(sites[cellDestinationID].confluence){
                            let confluenceData = confluence.filter(element => element.id == cellDestinationID),
                            angle;
                            if(s+1 !== Math.floor(riverAmended.length/3) && middle){
                                angle = Math.atan2(end.y - middle.y, end.x - middle.x);
                                confAngles[cellDestinationID] = angle;
                                //let midX = (start.x + middle.x) / 2,
                                //midY = (start.y + middle.y) / 2;
                                if(angle == undefined){
                                    angle = Math.atan2(end.y - middle.y, end.x - middle.x);
                                }

                            }
                            count = 0;
                            width = Math.pow(sites[cellDestinationID].flux, 0.9);
                            let df = (width * 3 / (50 - sizeInput.valueAsNumber * 2) - riverWidth) /2,
                            cellControle1 = confluenceData[0].start,
                            cellControle2 = confluenceData[1].start,
                            baseX = (sites[cellControle1][0] + sites[cellControle2][0]) / 2,
                            baseY = (sites[cellControle1][1] + sites[cellControle2][1]) / 2,
                            xCurve = -Math.sin(angle) * df + end.x,
                            yCurve = Math.cos(angle) * df + end.y,
                            xRiver = Math.sin(angle) * df + end.x,
                            yRiver = -Math.cos(angle) * df + end.y,
                            cross = ((baseX-end.x)*(start.y-end.y) - (baseY-end.y)*(start.x-end.x));

                            if(cross > 0){
                                xNode = xRiver;
                                yNode = yRiver;
                            } else {
                                xNode = xCurve;
                                yNode = yCurve;
                            }
                        }
                    }*/

                    contextCanvas.beginPath();
                    if (middle !== undefined && next !== undefined) {
                        line([ start, middle, end, next ]);
                    } else {
                        line([ start, end ]);
                    }
                    contextCanvas.lineWidth = riverWidth;
                    contextCanvas.strokeStyle = 'steelblue';
                    contextCanvas.stroke();
                }
            }
        }
    }
}
