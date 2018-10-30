var lines;

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

function downcutCoastLine(){
    let downcut = downcuttingInput.valueAsNumber;
    for (let i = 0; i < sites.length; i++) {
        if(sites[i].height >= 0.2){
            sites[i].height -= downcut;
        }
        
    }
}

function drawCoastLine(){
    lines.forEach(border => {
        let start_point = border.start.split(" "),
        end_point = border.end.split(" ");

        context.beginPath();
        context.moveTo(start_point[0], start_point[1]);
        context.lineTo(end_point[0], end_point[1]);
        context.closePath();
        if(border.type === 'Ocean'){
            context.strokeStyle = "#000";
            context.lineWidth = 2;
        } else {
            context.strokeStyle = "#296F92";
        }
        context.stroke();
    });
}

function resolveDepression(){
    
}