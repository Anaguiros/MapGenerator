import { poissonDiscSampler } from './poisson_disc_sampler';

import { processWorld } from './utils';
import { showWorld } from './renderer/renderer';
import { widthCanvas, heightCanvas } from "./renderer/canvas";

import { initHeights, add } from './heightmap';

let sample = null;

const worldState = {
    widthCanvas,
    heightCanvas,
    sites: [],
    delaunay: null,
    voronoi: null,
    altitudeOcean: 0.2,
    altitudePeak: 0.6,
    altitudeMax: 1,
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

function randomWorld(count) {
    console.time('randomWorld');
    if (document.getElementById('rngEnabled').checked) {
        // on initialise le RNG avec la seed fournie
        Math.seedrandom(document.getElementById('rngSeed').value);
    } else {
        // on affiche la seed pour pouvoir regénérer une map identique si besoin
        document.getElementById('rngSeed').value = Math.seedrandom();
    }

    const sampler = poissonDiscSampler(worldState.widthCanvas, worldState.heightCanvas, sizeInput.valueAsNumber);
    worldState.sites = [];

    while (sample = sampler()) {
        worldState.sites.push(sample);
    }
    worldState.delaunay = new d3.Delaunay.from(worldState.sites);
    worldState.voronoi = worldState.delaunay.voronoi([ 0.5, 0.5, worldState.widthCanvas - 0.5, worldState.heightCanvas - 0.5 ]);
    relax();
    initHeights();

    // Random Blobs
    for (let blob = 0; blob < count; blob++) {
        if (blob === 0) {
            const randomPolygonID = worldState.delaunay.find(
                (Math.random() * worldState.widthCanvas / 4) + (worldState.widthCanvas / 2),
                (Math.random() * worldState.heightCanvas / 6) + (worldState.heightCanvas / 2)
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
                const randomPolygonID = Math.floor(Math.random() * worldState.sites.length);
                iteration++;
                const site = worldState.voronoi.cellPolygon(randomPolygonID)[0];

                if (site[0] > worldState.widthCanvas * 0.25 && site[0] < worldState.widthCanvas * 0.75 && site[1] > worldState.heightCanvas * 0.25 && site[1] < worldState.heightCanvas * 0.75) {
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
    console.timeEnd('randomWorld');
}

export { randomWorld, worldState };
