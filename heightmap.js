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

    //affichage données mise à jour
    show();
}

function drawnCoastLine(){
    console.log("CoastLine");

    /*
    Algo drawn coastLine

    For all Polygons
        if height >= 0.20
            For all Neighbors
                if neighbors.height < 0.20
                    get 2 common points
                        Drawn coastline using the two points as limit

    */


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