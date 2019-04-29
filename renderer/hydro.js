import { contextCanvas, canvasDrawCircle } from './canvas.js';
import { worldState } from '../world.js';

function drawPrecipitation() {
    worldState.hydro.windsBuffer.forEach((wind) => {
        canvasDrawCircle(wind[0], wind[1], 1, 'white');
    });

    worldState.hydro.raining.forEach((rain) => {
        canvasDrawCircle(rain[0], rain[1], 0.3, 'blue');
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
    /* for (let i = 0; i < worldState.hydro.riversData.length; i++) {
        if(worldState.hydro.riversData[i].type == 'delta'){
            colorPolygon(worldState.hydro.riversData[i].cell, '#F00');
        } else if(worldState.hydro.riversData[i].type == 'estuary'){
            colorPolygon(worldState.hydro.riversData[i].cell, '#00F');
        } else if(worldState.hydro.riversData[i].type == 'source'){
            colorPolygon(worldState.hydro.riversData[i].cell, '#0F0');
        }
    }*/

    for (let i = 0; i < worldState.hydro.riversOrder.length; i++) {
        const dataRiver = worldState.hydro.riversData.filter((element) => element.river === worldState.hydro.riversOrder[i].river);

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
                            const mean = (worldState.sizePolygon / 10) + (Math.random() * (worldState.sizePolygon / 10));
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
                            const mean = (worldState.sizePolygon / 20) + (Math.random() * (worldState.sizePolygon / 20));
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

                    const cellDestinationID = worldState.delaunay.find(end.x, end.y);
                    let xNode = end.x;
                    let yNode = end.y;
                    // let riverWidth = ((count + width) * 3) / (50 - worldState.sizePolygon * 2);
                    let riverWidth = Math.sqrt((count + width));
                    count++;
                    /* if(cellDestinationID){
                        if(sites[cellDestinationID].confluence){
                            let confluenceData = worldState.hydro.confluence.filter(element => element.id == cellDestinationID),
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
                            let df = (width * 3 / (50 - worldState.sizePolygon * 2) - riverWidth) /2,
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

export { drawPrecipitation, drawnRiver };
