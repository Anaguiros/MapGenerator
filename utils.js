function show(){
    clearCanvas();
    showVoronoi();
    drawnCoastLine();
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
    let point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    d3.select("#cell").text(nearestId);
    d3.select("#high").text(sites[nearestId].height)
}

function clicked(){
    let point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    add(nearestId, 'hill');
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

function forEachTriangleEdge(callback){
    for (let e = 0; e < delaunay.triangles.length; e++) {
        if (e > delaunay.halfedges[e]) {
            const p = delaunay.points[delaunay.triangles[e]];
            const q = delaunay.points[delaunay.triangles[nextHalfedge(e)]];
            callback(e, p, q);
        }
    }
}

function edgesOfTriangle(triangleID){ 
    return [3 * triangleID, 3 * triangleID + 1, 3 * triangleID + 2];
}

function pointsOfTriangle(triangleID) {
    return edgesOfTriangle(triangleID)
        .map(e => delaunay.triangles[e]);
}

function forEachTriangle(callback) {
    for (let triangleID = 0; triangleID < delaunay.triangles.length / 3; triangleID++) {
        callback(triangleID, pointsOfTriangle(triangleID).map(p => [delaunay.points[p*2],delaunay.points[p*2+1]]));
    }
}

function triangleOfEdge(e){
    return Math.floor(e / 3);
}

function trianglesAdjacentToTriangle(t){
    const adjacentTriangles = [];
    for (const e of edgesOfTriangle(t)) {
        const opposite = delaunay.halfedges[e];
        if (opposite >= 0) {
            adjacentTriangles.push(triangleOfEdge(opposite));
        }
    }
    return adjacentTriangles;
}

function edgesAroundPoint(start) {
    const result = [];
    let incoming = start;
    do {
        result.push(incoming);
        const outgoing = nextHalfedge(incoming);
        incoming = delaunay.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
}

function uniqueBy(array, key) {
    var seen = {};
    return array.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
