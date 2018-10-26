function initHeights(){
    for (let i = 0; i < sites.length; i++) {
        sites[i].height = 0;
    }
}

function add(polygonStartID, type){
    let explorationQueue = new Array(),
    exploredPolygon = new Array(sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = false;
    }

    let height = highInput.valueAsNumber,
    radius = radiusInput.valueAsNumber,
    sharpness = sharpnessInput.valueAsNumber;

    sites[polygonStartID].height += height;
    exploredPolygon[polygonStartID] = true;
    explorationQueue.push(polygonStartID);
    for (let i = 0; i < explorationQueue.length && height > 0.01; i++) {
        if(type == "island"){
            height = sites[explorationQueue[i]].height * radius;
        } else {
            height = height * radius;
        }
        for (let neighborID of delaunay.neighbors(explorationQueue[i])) {
            if(!exploredPolygon[neighborID]){
                let noise = Math.random()*sharpness + 1.1 - sharpness;
                if(sharpness == 0){
                    noise = 1;
                }
                sites[neighborID].height += height * noise;
                if(sites[neighborID].height > 1){
                    sites[neighborID].height = 1;
                }
                exploredPolygon[neighborID] = true;
                explorationQueue.push(neighborID);
            }
        }
    }
}

/**
 * Principe d'innondation pour déterminer la coastline.
 * On part d'un coin (très faible proba d'être dans un lac), puis on innonde les voisins pour définir le type (ocean, lac)
 */
function markFeatures(){
    console.log("mark Features");
    let explorationPolygonIDQueue = new Array(),
    exploredPolygonID = new Array(),
    startpolygonID = delaunay.find(0,0),
    type = 'ocean',
    description;

    explorationPolygonIDQueue.push(startpolygonID);
    exploredPolygonID.push(startpolygonID);

    if(sites[startpolygonID].type){
        description = sites[startpolygonID].description;
    } else {
        description = adjectifs[Math.floor(Math.random() * adjectifs.length)];
    }
    sites[startpolygonID].type = type;
    sites[startpolygonID].description = description;

    while (explorationPolygonIDQueue.length > 0) {
        let exploredID = explorationPolygonIDQueue.shift();
        for (let neighborID of delaunay.neighbors(exploredID)) {
            if(exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < 0.2){
                sites[neighborID].type = type;
                sites[neighborID].description = description;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }

    let islandCounter = 0,
    lakeCounter = 0,
    numberID = 0,
    minHeight = 0,
    maxHeight = 0;

    let unmarked = new Array();
    for (let i = 0; i < sites.length; i++) {
        if(exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === "undefined" || true) ){
            unmarked.push(i);
        }
    }

    while (unmarked.length > 0) {
        if(sites[unmarked[0]].height >= 0.2){
            type = "Island";
            numberID = islandCounter++;
            minHeight = 0.2;
            maxHeight = 10;
        } else {
            type = "Lake";
            numberID = lakeCounter++;
            minHeight = -10;
            maxHeight = 0.2;
        }
        description = adjectifs[Math.floor(Math.random() * adjectifs.length)];
        startpolygonID = unmarked[0];
        sites[startpolygonID].type = type;
        sites[startpolygonID].description = description;
        sites[startpolygonID].number = numberID;

        explorationPolygonIDQueue.push(startpolygonID);
        exploredPolygonID.push(startpolygonID);
        while (explorationPolygonIDQueue.length > 0) {
            let exploredID = explorationPolygonIDQueue.shift();
            for (let neighborID of delaunay.neighbors(exploredID)) {
                if(exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < maxHeight && sites[neighborID].height >= minHeight){
                    sites[neighborID].type = type;
                    sites[neighborID].description = description;
                    sites[neighborID].number = numberID;
                    explorationPolygonIDQueue.push(neighborID);
                    exploredPolygonID.push(neighborID);
                }
            }
        }
        unmarked = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(exploredPolygonID.indexOf(i) < 0 && typeof sites[i].type === "undefined"){
                unmarked.push(i);
            }
        }

    }
    console.log(unmarked);

}

function drawnCoastLine(){
    console.log("CoastLine");

    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            for (let neighborID of delaunay.neighbors(i)) {
                if(sites[neighborID].height < 0.20){
                    let polygon = voronoi.cellPolygon(i);
                    let polygonNeighbor = voronoi.cellPolygon(neighborID);
                    let commonPoints = new Array();

                    polygon.forEach(point => {
                        polygonNeighbor.forEach(pointCommun => {
                            if (point[0] == pointCommun[0] && point[1] == pointCommun[1]){
                                commonPoints.push(pointCommun);
                            }
                        })
                    });

                    commonPoints = uniqueBy(commonPoints, JSON.stringify);
                    
                    context.beginPath();
                    context.moveTo(commonPoints[0][0], commonPoints[0][1]);
                    context.lineTo(commonPoints[1][0], commonPoints[1][1]);
                    context.closePath();
                    context.strokeStyle = "#000";
                    context.lineWidth = 2;
                    context.stroke();

                }
                
            }
            
        }
    }


}