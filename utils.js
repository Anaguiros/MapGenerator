var width_canvas = 960,
    height_canvas = 500,
    numberPoints = 8000;

var canvas = d3.select("canvas")
    .attr("width", width_canvas)
    .attr("height", height_canvas)
    .on("touchmove mousemove", moved)
    .on("click", clicked);
const context = document.getElementById('chart').getContext('2d');
var color = d3.scaleSequential(d3.interpolateSpectral);

var sites;

var delaunay;
var voronoi;

generate();

function generate(){
    sites = Array.from({length: numberPoints}, () => [Math.random() * width_canvas, Math.random() * height_canvas]);

    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);
    relax();
}

function relax(){
    var relaxedSites = new Array();
    for (let polygon of voronoi.cellPolygons()) { 
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    sites=relaxedSites
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);

    generateHeights();

    show();
}

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
        context.beginPath();
        voronoi.renderCell(i, context);
        context.fillStyle = color(1-heightmap[i]);
        context.fill();
    }
}

function clearCanvas(){
    context.clearRect(0,0,width_canvas,height_canvas);
}

function moved(){
    var point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    d3.select("#cell").text(nearestId);
    d3.select("#high").text(heightmap[nearestId])
}

function clicked(){
    var point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]);

    if(heightmap.findIndex(function(element) {return element > 0}) != -1){
        //premier ajout
        add(nearestId, 'island');
        highOutput.value = 0.2;
        radiusInput.value = 0.99;
        radiusOutput.value = 0.99;
    } else {
        add(nearestId, 'hill');
        highInput.value = Math.random() * 0.4 + 0.1;
    }
}

