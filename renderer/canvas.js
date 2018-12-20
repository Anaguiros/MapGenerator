const contextCanvas = d3.select('canvas').node().getContext('2d');

function clearCanvas() {
    contextCanvas.clearRect(0, 0, widthCanvas, heightCanvas);
}