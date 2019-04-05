import { moved, clicked } from '../utils.js';

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

function canvasColorPolygon(points, color, border = false) {
    contextCanvas.moveTo(points[0][0], points[0][1]);
    contextCanvas.beginPath();
    for (let i = 1; i < points.length; i++) {
        contextCanvas.lineTo(points[i][0], points[i][1]);
    }
    contextCanvas.closePath();
    contextCanvas.fillStyle = color;
    contextCanvas.fill();
    if (border) {
        contextCanvas.strokeStyle = '#A0A0A0';
    } else {
        contextCanvas.strokeStyle = color;
    }
    contextCanvas.stroke();
}

function canvasDrawLine(startPoint, endPoint, color, width = 1) {
    contextCanvas.beginPath();
    contextCanvas.moveTo(startPoint[0], startPoint[1]);
    contextCanvas.lineTo(endPoint[0], endPoint[1]);
    contextCanvas.closePath();
    contextCanvas.strokeStyle = color;
    contextCanvas.lineWidth = width;
    contextCanvas.stroke();
}

function canvasDrawCircle(x, y, radius, colorFill, colorStroke) {
    if (typeof colorStroke === 'undefined') {
        colorStroke = colorFill;
    }

    contextCanvas.beginPath();
    contextCanvas.arc(x, y, radius, 0, 2 * Math.PI, false);
    contextCanvas.fillStyle = colorFill;
    contextCanvas.fill();
    contextCanvas.lineWidth = 1;
    contextCanvas.strokeStyle = colorStroke;
    contextCanvas.stroke();
}

export { contextCanvas, widthCanvas, heightCanvas };
export { clearScreen, canvasColorPolygon, canvasDrawLine, canvasDrawCircle };
