const width_canvas = 1228,
    height_canvas = 640;

const canvas = d3.select("canvas")
    .attr("width", width_canvas)
    .attr("height", height_canvas)
    .on("touchmove mousemove", moved)
    .on("click", clicked);
const context = document.getElementById('chart').getContext('2d');
const colorNatural = d3.scaleSequential(d3.interpolateSpectral);
const colorWeather = d3.scaleSequential(d3.interpolateBlues);

var sampler,
    sites,
    sample;

var delaunay;
var voronoi;

var adjectifs = [
    "Ablaze", "Ablazing", "Accented", "Ashen", "Ashy", "Beaming", "Bi-Color", "Blazing", "Bleached", "Bleak", 
    "Blended", "Blotchy", "Bold", "Brash", "Bright", "Brilliant", "Burnt", "Checkered", "Chromatic", "Classic", 
    "Clean", "Colored", "Colorful", "Colorless", "Complementing", "Contrasting", "Cool", "Coordinating", "Crisp", "Dappled", 
    "Dark", "Dayglo", "Deep", "Delicate", "Digital", "Dim", "Dirty", "Discolored", "Dotted", "Drab", 
    "Dreary", "Dull", "Dusty", "Earth", "Electric", "Eye-Catching", "Faded", "Faint", "Festive", "Fiery", 
    "Flashy", "Flattering", "Flecked", "Florescent", "Frosty", "Full-Toned", "Glistening", "Glittering", "Glowing", "Harsh", 
    "Hazy", "Hot", "Hued", "Icy", "Illuminated", "Incandescent", "Intense", "Interwoven", "Iridescent", "Kaleidoscopic", 
    "Lambent", "Light", "Loud", "Luminous", "Lusterless", "Lustrous", "Majestic", "Marbled", "Matte", "Medium", 
    "Mellow", "Milky", "Mingled", "Mixed", "Monochromatic", "Motley", "Mottled", "Muddy", "Multicolored", "Multihued", 
    "Murky", "Natural", "Neutral", "Opalescent", "Opaque", "Pale", "Pastel", "Patchwork", "Patchy", "Patterned", 
    "Perfect", "Picturesque", "Plain", "Primary", "Prismatic", "Psychedelic", "Pure", "Radiant", "Reflective", "Rich", 
    "Royal", "Ruddy", "Rustic", "Satiny", "Saturated", "Secondary", "Shaded", "Sheer", "Shining", "Shiny", 
    "Shocking", "Showy", "Smoky", "Soft", "Solid", "Somber", "Soothing", "Sooty", "Sparkling", "Speckled", 
    "Stained", "Streaked", "Streaky", "Striking", "Strong Neutral", "Subtle", "Sunny", "Swirling", "Tinged", "Tinted", 
    "Tonal", "Toned", "Translucent", "Transparent", "Two-Tone", "Undiluted", "Uneven", "Uniform", "Vibrant", "Vivid", 
    "Wan", "Warm", "Washed-Out", "Waxen", "Wild"
];

randomWorld(9);

function randomWorld(count){

    sampler = poissonDiscSampler(width_canvas, height_canvas, sizeInput.valueAsNumber);
    sites = new Array();

    while (sample = sampler()){
        sites.push(sample);
    } 
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);
    relax();
    initHeights();
    
    //Random Blobs
    for (c = 0; c < count; c++) {
        if(c==0){
            var randomPolygonID = delaunay.find(Math.random() * width_canvas / 4 + width_canvas / 2, Math.random() * height_canvas / 6 + height_canvas / 2);
            //highInput.value = 0.3;
            //highOutput.value = 0.3;
            //radiusInput.value = 0.98;
            //radiusOutput.value = 0.98;
            add(randomPolygonID, "island");
        } else {
            const limit_random = 20;
            let iteration = 0;
            while (iteration < limit_random) {
                const randomPolygonID = Math.floor(Math.random() * sites.length);
                iteration++;
                const site = voronoi.cellPolygon(randomPolygonID)[0];

                if(site[0] > width_canvas*0.25 && site[0] < width_canvas*0.75 && site[1] > height_canvas*0.25 && site[1] < height_canvas*0.75){
                    //const randomHeight = (Math.random() * 0.4 + 0.1).toFixed(2);
                    //highInput.value = randomHeight;
                    //highOutput.value = randomHeight;
                    add(randomPolygonID, "hill");
                }
            }
            
            

        }
    }
    processWorld();
    showWorld();
}

function relax(){
    let relaxedSites = new Array();
    for (const polygon of voronoi.cellPolygons()) { 
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    sites=relaxedSites
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([0.5, 0.5, width_canvas - 0.5, height_canvas - 0.5]);
}