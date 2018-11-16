/* globals delaunay */
/* globals sites widthCanvas heightCanvas*/

/**
 * Principe d'innondation pour déterminer la coastline.
 * On part d'un coin (très faible proba d'être dans un lac), puis on innonde les voisins pour définir le type (ocean, lac)
 */
function generateFeatures() {
    lines = [];

    const initPoints = [ [ 0, 0 ], [ widthCanvas - 1, 0 ], [ 0, heightCanvas - 1 ], [ widthCanvas - 1, heightCanvas - 1 ] ];
    let startPoint = [ 0, 0 ];
    initPoints.forEach((coord) => {
        if (sites[delaunay.find(coord[0], coord[1])].height < 0.2) {
            startPoint = [ coord[0], coord[1] ];
        }
    });

    const explorationPolygonIDQueue = [];
    const exploredPolygonID = [];
    let startpolygonID = delaunay.find(startPoint[0], startPoint[1]);
    let type = 'Ocean';
    let description = '';

    explorationPolygonIDQueue.push(startpolygonID);
    exploredPolygonID.push(startpolygonID);

    if (sites[startpolygonID].type === 'Ocean') {
        description = sites[startpolygonID].description;
    } else {
        description = generator$places$waters();
    }
    sites[startpolygonID].type = type;
    sites[startpolygonID].description = description;

    while (explorationPolygonIDQueue.length > 0) {
        const exploredID = explorationPolygonIDQueue.shift();
        for (const neighborID of delaunay.neighbors(exploredID)) {
            if (exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < 0.2) {
                sites[neighborID].type = type;
                sites[neighborID].description = description;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }

    let islandCounter = 1;
    let lakeCounter = 1;
    let numberID = 0;
    let minHeight = 0;
    let maxHeight = 0;

    let unmarked = [];
    for (let i = 0; i < sites.length; i++) {
        if (exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === 'undefined')) {
            unmarked.push(i);
        }
    }

    while (unmarked.length > 0) {
        startpolygonID = unmarked[0];

        if (sites[startpolygonID].height >= 0.2) {
            type = 'Island';
            numberID = islandCounter;
            islandCounter += 1;
            minHeight = 0.2;
            maxHeight = 10;
            description = generator$places$forests();
        } else {
            type = 'Lake';
            numberID = lakeCounter;
            lakeCounter += 1;
            minHeight = -10;
            maxHeight = 0.2;
            description = generator$places$lakes();
        }

        if (sites[startpolygonID].description && sites[startpolygonID].type === type) {
            description = sites[startpolygonID].description;
        }

        sites[startpolygonID].type = type;
        sites[startpolygonID].description = description;
        sites[startpolygonID].numberID = numberID;

        explorationPolygonIDQueue.push(startpolygonID);
        exploredPolygonID.push(startpolygonID);
        while (explorationPolygonIDQueue.length > 0) {
            const exploredID = explorationPolygonIDQueue.shift();
            for (const neighborID of delaunay.neighbors(exploredID)) {
                // Generation CoastLine
                if (sites[neighborID].height < 0.2 && type === 'Island') {
                    let commonPoints = [];
                    let typeCoastline = 'Ocean';
                    let numberBorder = -1;

                    commonPoints = getCommonPoints(exploredID, neighborID);

                    const start = commonPoints[0];
                    const end = commonPoints[1];

                    if (sites[neighborID].type === 'Ocean' || sites[neighborID].type === 'Recif') {
                        sites[neighborID].type = 'Recif';
                        typeCoastline = 'Ocean';
                        numberBorder = sites[exploredID].numberID;
                    } else {
                        typeCoastline = 'Lake';
                        numberBorder = sites[neighborID].numberID;
                    }

                    lines.push({ start, end, typeCoastline, numberBorder });
                }


                if (exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < maxHeight && sites[neighborID].height >= minHeight) {
                    sites[neighborID].type = type;
                    sites[neighborID].description = description;
                    sites[neighborID].numberID = numberID;
                    explorationPolygonIDQueue.push(neighborID);
                    exploredPolygonID.push(neighborID);
                }
            }
        }
        unmarked = [];
        for (let i = 0; i < sites.length; i++) {
            if (exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === 'undefined')) {
                unmarked.push(i);
            }
        }
    }
}
