var heightmap;

function initHeights(){
    heightmap = new Array();
    for (let i = 0; i < sites.length; i++) {
        heightmap.splice( i, 0, 0);
    }
}

function add(polygonStartID, type){
    var explorationQueue = new Array(),
    exploredPolygon = new Array(sites.length-1);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = false;
    }

    var height = highInput.valueAsNumber,
    radius = radiusInput.valueAsNumber,
    sharpness = sharpnessInput.valueAsNumber;

    heightmap[polygonStartID] += height;
    exploredPolygon[polygonStartID] = true;
    explorationQueue.push(polygonStartID);
    for (let i = 0; i < explorationQueue.length && height > 0.01; i++) {
        if(type == "island"){
            height = heightmap[explorationQueue[i]] * radius;
        } else {
            height *= radius;
        }
        for (let neighborID of delaunay.neighbors(explorationQueue[i])) {
            if(!exploredPolygon[neighborID]){
                var noise = Math.random()*sharpness + 1.1 - sharpness;
                if(sharpness == 0){
                    noise = 1;
                }
                heightmap[neighborID] += height * noise;
                if(heightmap[neighborID] > 1){
                    heightmap[neighborID] = 1;
                }
                exploredPolygon[neighborID] = true;
                explorationQueue.push(neighborID);
            }
        }
    }

    //affichage données mise à jour
    show();
}