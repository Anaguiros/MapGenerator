var heightmap = new Array();

function generateHeights() {
    for (let i = 0; i < sites.length; i++) {
        heightmap.splice( i, 0, Math.random());
    }
}