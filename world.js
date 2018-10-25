var width_canvas = 1228,
    height_canvas = 640;

var canvas = d3.select("canvas")
    .attr("width", width_canvas)
    .attr("height", height_canvas)
    .on("touchmove mousemove", moved)
    .on("click", clicked);
const context = document.getElementById('chart').getContext('2d');
var color = d3.scaleSequential(d3.interpolateSpectral);

var sampler,
    sites,
    sample;

var delaunay;
var voronoi;

generate(9);

function generate(count){

    sampler = poissonDiscSampler(width_canvas, height_canvas, sizeInput.valueAsNumber);
    sites = new Array();

    while (sample = sampler()){
        sites.push(sample);
    } 
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);
    relax();
    
    //Random Blobs
    for (c = 0; c < count; c++) {
        if(c==0){
            var randomPolygonID = delaunay.find(Math.random() * width_canvas / 4 + width_canvas / 2, Math.random() * height_canvas / 6 + height_canvas / 2);
            highInput.value = 0.3;
            highOutput.value = 0.3;
            radiusInput.value = 0.98;
            radiusOutput.value = 0.98;
            add(randomPolygonID, "island");
        } else {
            let limit_random = 20, iteration = 0;
            while (iteration < limit_random) {
                let randomPolygonID = Math.floor(Math.random() * sites.length);
                iteration++;
                let site = voronoi.cellPolygon(randomPolygonID)[0];

                if(site[0] > width_canvas*0.25 && site[0] < width_canvas*0.75 && site[1] > height_canvas*0.25 && site[1] < height_canvas*0.75){
                    let randomHeight = (Math.random() * 0.4 + 0.1).toFixed(2);
                    highInput.value = randomHeight;
                    highOutput.value = randomHeight;
                    add(randomPolygonID, "hill");
                }
            }
            
            

        }
    }

    //Drawn coastlines
    drawnCoastLine();

}

function relax(){
    let relaxedSites = new Array();
    for (let polygon of voronoi.cellPolygons()) { 
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    sites=relaxedSites
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);

    initHeights();
    show();
}