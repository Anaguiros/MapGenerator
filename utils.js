var width = 960,
    height = 500,
    numberPoints = 200;

d3.select("canvas").attr("width", width).attr("height", height);

const context = document.getElementById('chart').getContext('2d')
var sites = Array.from({length: numberPoints}, () => [Math.random() * width, Math.random() * height]);

var delaunay = new d3.Delaunay.from(sites);
var voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

show();
relax();

function relax(){
    iteration.value = +iteration.value + 1;

    var relaxedSites = new Array();
    for (let polygon of voronoi.cellPolygons()) { 
        relaxedSites.push(d3.polygonCentroid(polygon));
    }
    delaunay = new d3.Delaunay.from(relaxedSites);
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
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

    context.beginPath();
    voronoi.render(context);
    context.strokeStyle = "#555";
    context.stroke();
}

function clearCanvas(){
    context.clearRect(0,0,width,height);
}

var randomColor = Math.floor(Math.random()*16777215).toString(16);

