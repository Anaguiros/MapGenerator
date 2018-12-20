const widthCanvas = 1228;
const heightCanvas = 640;

d3.select('canvas')
    .attr('width', widthCanvas)
    .attr('height', heightCanvas)
    .on('touchmove mousemove', moved)
    .on('click', clicked);

const contextCanvas = d3.select('canvas').node().getContext('2d');

function clearScreen() {
    contextCanvas.clearRect(0, 0, widthCanvas, heightCanvas);
}

function canvasColorPolygon(points, color) {
    contextCanvas.moveTo(points[0][0], points[0][1]);
    contextCanvas.beginPath();
    for (let i = 1; i < points.length; i++) {
        contextCanvas.lineTo(points[i][0], points[i][1]);
    }
    contextCanvas.closePath();
    contextCanvas.fillStyle = color;
    contextCanvas.fill();
    contextCanvas.strokeStyle = color;
    contextCanvas.stroke();
}
