function show(){
    clearCanvas();
    showSite();
    showVoronoi();
}

function showTriangles(){
    context.beginPath();
    delaunay.render(context);
    context.strokeStyle = "#ccc";
    context.stroke();
}

function showSite(){
    context.beginPath();
    delaunay.renderPoints(context);
    context.fillStyle = "#f00";
    context.fill();
}

function showVoronoi(){
    context.beginPath();
    voronoi.renderBounds(context);
    context.strokeStyle = "#000";
    context.stroke();

    for (let i = 0; i < sites.length; i++) {
        colorPolygon(i, color(1-sites[i].height));
    }
}

function colorPolygon(polygonID, color){
    context.beginPath();
        voronoi.renderCell(polygonID, context);
        context.fillStyle = color;
        context.fill();
}

function clearCanvas(){
    context.clearRect(0,0,width_canvas,height_canvas);
}

function moved(){
    var point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    d3.select("#cell").text(nearestId);
    d3.select("#high").text(sites[nearestId].height)
}

function clicked(){
    var point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    add(nearestId, 'hill');
}

function edgesOfTriangle(t){
    return [3 * t, 3 * t + 1, 3 * t + 2]; 
}

function triangleOfEdge(e) {
    return Math.floor(e / 3);
}

function nextHalfedge(e){
    return (e % 3 === 2) ? e - 2 : e + 1;
}

function prevHalfedge(e){
    return (e % 3 === 0) ? e + 2 : e - 1;
}

function edgesAroundPoint(delaunay, start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}
