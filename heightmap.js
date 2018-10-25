function initHeights(){
    for (let i = 0; i < sites.length; i++) {
        sites[i].height = 0;
    }
}

function add(polygonStartID, type){
    var explorationQueue = new Array(),
    exploredPolygon = new Array(sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = false;
    }

    var height = highInput.valueAsNumber,
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
                var noise = Math.random()*sharpness + 1.1 - sharpness;
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

    //affichage données mise à jour
    show();
}

function drawnCoastLine(){

    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            console.log(i);
    }


}