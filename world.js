import { poissonDiscSampler } from './poisson_disc_sampler.js';
import { processWorld } from './utils.js';
import { showWorld } from './renderer/renderer.js';
import { widthCanvas, heightCanvas } from './renderer/canvas.js';

let sample = null;

const worldState = {
    widthCanvas,
    heightCanvas,
    sizePolygon: 5,
    sites: [],
    delaunay: null,
    voronoi: null,
    altitudeOcean: 20,
    altitudePeak: 60,
    altitudeMax: 100,
    landPolygonID: [],
    coastLines: [],
    hydro: {
        windsBuffer: [],
        raining: [],
        riversData: [],
        riverID: 0,
        riversOrder: [],
        confluence: [],
    },
};

function relax() {
    const relaxedSites = [];
    for (const polygon of worldState.voronoi.cellPolygons()) {
        relaxedSites.push(d3.polygonCentroid(polygon));
    }

    worldState.sites = relaxedSites;
    worldState.delaunay = new d3.Delaunay.from(worldState.sites);
    worldState.voronoi = worldState.delaunay.voronoi([ 0.5, 0.5, worldState.widthCanvas - 0.5, worldState.heightCanvas - 0.5 ]);
}

function randomWorld() {
    console.time('randomWorld');
    if (document.getElementById('rngEnabled').checked) {
        // on initialise le RNG avec la seed fournie
        Math.seedrandom(document.getElementById('rngSeed').value);
    } else {
        // on affiche la seed pour pouvoir regénérer une map identique si besoin
        // document.getElementById('rngSeed').value = Math.seedrandom();
        document.getElementById('rngSeed').value = generator$places$islands();
    }


    const sampler = poissonDiscSampler(worldState.widthCanvas, worldState.heightCanvas, worldState.sizePolygon);
    worldState.sites = [];

    while (sample = sampler()) {
        worldState.sites.push(sample);
    }
    worldState.delaunay = new d3.Delaunay.from(worldState.sites);
    worldState.voronoi = worldState.delaunay.voronoi([ 0.5, 0.5, worldState.widthCanvas - 0.5, worldState.heightCanvas - 0.5 ]);
    relax();

    processWorld();
    showWorld();
    console.timeEnd('randomWorld');
}

randomWorld();

export { randomWorld, worldState };
