var width = 960,
    height = 500,
    numberPoints = 10;

var canvas = d3.select("canvas").attr("width", width).attr("height", height);
canvas.on("touchmove mousemove", moved);
const context = document.getElementById('chart').getContext('2d');
var color = d3.scaleSequential(d3.interpolateSpectral);

var sites;

var delaunay;
var voronoi;

generate();

console.log(voronoi);
console.log(delaunay);

function generate(){
    console.log("generate !");
    sites = Array.from({length: numberPoints}, () => [Math.random() * width, Math.random() * height]);

    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
    relax();
}

function relax(){
    var relaxedSites = new Array();
    for (let polygon of voronoi.cellPolygons()) { 
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    sites=relaxedSites
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

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
    context.clearRect(0,0,width,height);
}

function moved(){
    var point = d3.mouse(this),
    nearestId = delaunay.find(point[0], point[1]),

    d3.select("#cell").text(nearestId);
    d3.select("#high").text(heightmap[nearestId])
}

