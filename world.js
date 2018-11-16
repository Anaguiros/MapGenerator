const widthCanvas = 1228;
const heightCanvas = 640;

const canvas = d3.select('canvas')
    .attr('width', widthCanvas)
    .attr('height', heightCanvas)
    .on('touchmove mousemove', moved)
    .on('click', clicked)
    // .call(d3.zoom().translateExtent([[0,0],[width_canvas, height_canvas]]).scaleExtent([1, 40]).on('zoom', zoom))
    ;

const contextCanvas = d3.select('canvas').node().getContext('2d');
const colorNatural = d3.scaleSequential(d3.interpolateSpectral);
const colorWeather = d3.scaleSequential(d3.interpolateBlues);

let sampler;
let sites;
let sample;

let delaunay;
let voronoi;

const adjectifs = [
    'Ablaze', 'Ablazing', 'Accented', 'Ashen', 'Ashy', 'Beaming', 'Bi-Color', 'Blazing', 'Bleached', 'Bleak',
    'Blended', 'Blotchy', 'Bold', 'Brash', 'Bright', 'Brilliant', 'Burnt', 'Checkered', 'Chromatic', 'Classic',
    'Clean', 'Colored', 'Colorful', 'Colorless', 'Complementing', 'Contrasting', 'Cool', 'Coordinating', 'Crisp', 'Dappled',
    'Dark', 'Dayglo', 'Deep', 'Delicate', 'Digital', 'Dim', 'Dirty', 'Discolored', 'Dotted', 'Drab',
    'Dreary', 'Dull', 'Dusty', 'Earth', 'Electric', 'Eye-Catching', 'Faded', 'Faint', 'Festive', 'Fiery',
    'Flashy', 'Flattering', 'Flecked', 'Florescent', 'Frosty', 'Full-Toned', 'Glistening', 'Glittering', 'Glowing', 'Harsh',
    'Hazy', 'Hot', 'Hued', 'Icy', 'Illuminated', 'Incandescent', 'Intense', 'Interwoven', 'Iridescent', 'Kaleidoscopic',
    'Lambent', 'Light', 'Loud', 'Luminous', 'Lusterless', 'Lustrous', 'Majestic', 'Marbled', 'Matte', 'Medium',
    'Mellow', 'Milky', 'Mingled', 'Mixed', 'Monochromatic', 'Motley', 'Mottled', 'Muddy', 'Multicolored', 'Multihued',
    'Murky', 'Natural', 'Neutral', 'Opalescent', 'Opaque', 'Pale', 'Pastel', 'Patchwork', 'Patchy', 'Patterned',
    'Perfect', 'Picturesque', 'Plain', 'Primary', 'Prismatic', 'Psychedelic', 'Pure', 'Radiant', 'Reflective', 'Rich',
    'Royal', 'Ruddy', 'Rustic', 'Satiny', 'Saturated', 'Secondary', 'Shaded', 'Sheer', 'Shining', 'Shiny',
    'Shocking', 'Showy', 'Smoky', 'Soft', 'Solid', 'Somber', 'Soothing', 'Sooty', 'Sparkling', 'Speckled',
    'Stained', 'Streaked', 'Streaky', 'Striking', 'Strong Neutral', 'Subtle', 'Sunny', 'Swirling', 'Tinged', 'Tinted',
    'Tonal', 'Toned', 'Translucent', 'Transparent', 'Two-Tone', 'Undiluted', 'Uneven', 'Uniform', 'Vibrant', 'Vivid',
    'Wan', 'Warm', 'Washed-Out', 'Waxen', 'Wild',
];

randomWorld(9);

function randomWorld(count) {
    if (document.getElementById('rngEnabled').checked) {
        // on initialise le RNG avec la seed fournie
        Math.seedrandom(document.getElementById('rngSeed').value);
    } else {
        // on affiche la seed pour pouvoir regénérer une map identique si besoin
        document.getElementById('rngSeed').value = Math.seedrandom();
    }

    sampler = poissonDiscSampler(widthCanvas, heightCanvas, sizeInput.valueAsNumber);
    sites = [];

    while (sample = sampler()) {
        sites.push(sample);
    }
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([ 0.5, 0.5, widthCanvas - 0.5, heightCanvas - 0.5 ]);
    relax();
    initHeights();

    // Random Blobs
    for (let blob = 0; blob < count; blob++) {
        if (blob === 0) {
            const randomPolygonID = delaunay.find(
                (Math.random() * widthCanvas) / (4 + (widthCanvas / 2)),
                (Math.random() * heightCanvas) / (6 + (heightCanvas / 2))
            );
            // highInput.value = 0.3;
            // highOutput.value = 0.3;
            // radiusInput.value = 0.98;
            // radiusOutput.value = 0.98;
            add(randomPolygonID, 'island');
        } else {
            const limitRandom = 20;
            let iteration = 0;
            while (iteration < limitRandom) {
                const randomPolygonID = Math.floor(Math.random() * sites.length);
                iteration++;
                const site = voronoi.cellPolygon(randomPolygonID)[0];

                if (site[0] > widthCanvas * 0.25 && site[0] < widthCanvas * 0.75 && site[1] > heightCanvas * 0.25 && site[1] < heightCanvas * 0.75) {
                    // const randomHeight = (Math.random() * 0.4 + 0.1).toFixed(2);
                    // highInput.value = randomHeight;
                    // highOutput.value = randomHeight;
                    add(randomPolygonID, 'hill');
                }
            }
        }
    }
    processWorld();
    showWorld();
}

function relax() {
    const relaxedSites = [];
    for (const polygon of voronoi.cellPolygons()) {
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    sites = relaxedSites;
    delaunay = new d3.Delaunay.from(sites);
    voronoi = delaunay.voronoi([ 0.5, 0.5, widthCanvas - 0.5, heightCanvas - 0.5 ]);
}
