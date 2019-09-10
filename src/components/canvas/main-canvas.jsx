import React from 'react';
import './canvas.css';
import {
  getMousePos,
  getNearestSquare,
  getSquareIndex,
  addPixelBySize,
  handleContextMenu,
  drawCanvas,
  drawCircle,
  drawLine,
  drawPoints,
  drawRect,
  fillArea,
} from '../../utils/canvas-helpers';

const getCurrFrameCanvas = (id) => {
  let frameId = '#canvas';
  frameId += id;
  return document.querySelector(frameId);
};

const copyArray = (sourceArray) => {
  const newArray = sourceArray.map(arr => arr.slice());
  return newArray;
};

const createPixelsArr = (N) => {
  const pixels = Array.from(Array(N), () => new Array(N));
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      pixels[i][j] = 'transparent';
    }
  }
  return pixels;
};

const displayCoords = (evt, size, pxSize) => {
  let pos = { x: 0, y: 0 };
  if (evt) pos = getMousePos(evt);
  pos = getNearestSquare(pos.x, pos.y, pxSize);
  document.querySelector('.info').innerHTML = `${size}x${size}, x:${pos.x - 0.5}, y:${pos.y - 0.5}`;
};

class Canvas extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isDrawing: false,
      currentFrame: 0,
      pxSize: Math.trunc(480 / props.sideSize),
      size: props.sideSize,
      pixels: [],
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.setActiveFrameCTX = this.setActiveFrameCTX.bind(this);
    this.draw = this.draw.bind(this);
    this.starPos = { x: 0, y: 0 };
    this.imgData = null;
    this.pixels = [];
    this.mouseBtn = 0;
    this.penSize = 1;
    this.width = this.state.pxSize * this.state.size;
  }

  componentDidMount() {
    const canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');
    canvas.addEventListener('contextmenu', this.handleContextMenu);
    this.width = this.state.pxSize * this.state.size;
    const pixels = createPixelsArr(this.state.size);
    this.imgData = this.ctx.getImageData(0, 0, this.width, this.width);
    this.pixels = copyArray(pixels);
    this.setState({ pixels });
    drawCanvas(true, this.ctx, pixels, this.state.pxSize);
    displayCoords(null, this.state.size, this.state.pxSize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.size !== nextProps.sideSize) {
      this.pixels = createPixelsArr(nextProps.sideSize);
      const pxSize = 480 / nextProps.sideSize;
      this.setState({
        currentFrame: 0,
        pixels: this.pixels,
        size: nextProps.sideSize,
        pxSize,
      });
      this.setActiveFrameCTX(0);
      displayCoords(null, nextProps.sideSize, pxSize);
    }

    if (nextProps.activeFrame !== this.state.currentFrame) {
      this.pixels = copyArray(nextProps.pixelsArray[nextProps.activeFrame]);
      const pxSize = 480 / nextProps.sideSize;
      this.setState({
        currentFrame: nextProps.activeFrame,
        pixels: copyArray(this.pixels),
        size: nextProps.sideSize,
        pxSize,
      });
      this.setActiveFrameCTX(nextProps.activeFrame);
    }
  }

  setActiveFrameCTX(id) {
    const activeFrameCanvas = getCurrFrameCanvas(id);
    if (activeFrameCanvas) {
      this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
      drawCanvas(true, this.ctx, this.pixels, this.state.pxSize);
    }
  }

  handleMouseDown(evt) {
    if (evt.button !== 0 && evt.button !== 2) {
      return;
    }
    let color = this.props.penColor;
    if (evt.button === 2) {
      color = this.props.bkgPenColor;
      this.mouseBtn = 2;
    }
    this.startPos = getNearestSquare(getMousePos(evt).x, getMousePos(evt).y, this.state.pxSize);
    this.imgData = this.ctx.getImageData(0, 0, this.width, this.width);
    this.pixels = copyArray(this.state.pixels);
    this.draw(this.props.penType, evt, color, this.props.penSize);
    this.setState({
      isDrawing: true,
    });
  }

  handleMouseMove(evt) {
    displayCoords(evt, this.state.size, this.state.pxSize);
    if (this.state.isDrawing) {
      let color = this.props.penColor;
      if (this.mouseBtn !== 0) color = this.props.bkgPenColor;
      this.draw(this.props.penType, evt, color, this.props.penSize);
    }
  }

  handleMouseUp() {
    if (this.state.isDrawing) {
      const activeFrameCanvas = getCurrFrameCanvas(this.state.currentFrame);
      const currFrameCtx = activeFrameCanvas.getContext('2d');
      currFrameCtx.restore();
      currFrameCtx.clearRect(0, 0, 96, 96);
      currFrameCtx.save();
      const cScale = 96 / this.state.size;
      currFrameCtx.scale(cScale, cScale);
      drawCanvas(false, currFrameCtx, this.pixels, 1);
      // const imgData = currFrameCtx.getImageData(0, 0, 96, 96);
      const frameURL = `url('${activeFrameCanvas.toDataURL()}')`;
      currFrameCtx.restore();
      currFrameCtx.clearRect(0, 0, 96, 96);

      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.height = this.state.size;
      tmpCanvas.width = this.state.size;
      document.body.appendChild(tmpCanvas);
      tmpCanvas.style.display = 'none';
      const tmpCTX = tmpCanvas.getContext('2d');
      drawCanvas(false, tmpCTX, this.pixels, 1);

      this.mouseBtn = 0;
      this.setState({
        isDrawing: false,
        pixels: this.pixels,
      });
      // setTimeout(() => { console.log('STATE ', this.state.pixels); }, 200);
      this.props.addImageToState(this.state.currentFrame, tmpCanvas.toDataURL('image/png'), frameURL, this.pixels);
      document.body.removeChild(tmpCanvas);
    }
  }

  draw(mode, evt, color, penSize) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    const size = this.state.pxSize;
    if (mode !== 'pen' && mode !== 'eraser') {
      this.ctx.clearRect(0, 0, this.width, this.width);
      this.ctx.putImageData(this.imgData, 0, 0);
      this.pixels = copyArray(this.state.pixels);
      this.ctx.beginPath();
      if (mode !== 'circle') {
        this.ctx.moveTo(this.startPos.x, this.startPos.y);
      }
    }
    let newPixelsArr = [];
    const startPos = getSquareIndex(this.startPos.x, this.startPos.y, size);
    let pos = getNearestSquare(getMousePos(evt).x, getMousePos(evt).y, size);
    pos = getSquareIndex(pos.x, pos.y, size);

    switch (mode) {
      case 'line': {
        newPixelsArr = drawLine(startPos.row, startPos.col, pos.row, pos.col, color, penSize, this.state.size);
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }
      case 'rectangle': {
        newPixelsArr = drawRect(startPos.row, startPos.col, pos.row, pos.col, color, penSize, this.state.size);
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }
      case 'circle': {
        const a = pos.row - startPos.row;
        const b = pos.col - startPos.col;
        const dx = Math.trunc(Math.abs(a / 2));
        const dy = Math.trunc(Math.abs(b / 2));
        const x = (a >= 0) ? startPos.row + dx : pos.row + dx;
        const y = (b >= 0) ? startPos.col + dy : pos.col + dy;
        let r = (Math.abs(a) > Math.abs(b)) ? Math.abs(b) : Math.abs(a);
        r = Math.trunc(r / 2);
        newPixelsArr = drawCircle(x, y, r, color, penSize, this.state.size);
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }
      case 'eraser': {
        addPixelBySize(newPixelsArr, pos.row, pos.col, penSize, this.state.size, 'transparent');
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }

      case 'bucket': {
        newPixelsArr = fillArea(this.startPos, color, size, this.pixels);
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }

      default: {
        addPixelBySize(newPixelsArr, pos.row, pos.col, penSize, this.state.size, color);
        drawPoints(this.ctx, newPixelsArr, size);
        break;
      }
    }
    /* обновление массива pixels */
    newPixelsArr.forEach((p) => {
      this.pixels[p.x][p.y] = p.color;
    });
  }

  render() {
    return (
      <canvas
        id="canvas"
        className = 'canvas'
        ref="canvas"
        width={480}
        height={480}
        onClick={this.clickHandler}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onContextMenu = {handleContextMenu}

      />
    );
  }
}

export default Canvas;
