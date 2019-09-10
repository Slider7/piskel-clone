import React from 'react';
import Header from '../header/header.jsx';
import Palette from '../palette/palette.jsx';
import Canvas from '../canvas/main-canvas.jsx';
import Player from '../tools/player/player.jsx';
import FileManager from '../tools/filesave/filesave.jsx';

import './main.css';
import {
  moveFrame,
  getIndexById,
  resetFramesId,
  createPixelsArray,
  getSettings,
} from '../../utils/helpers';

const closeFS = () => {
  document.querySelector('.fs-wrapper').classList.toggle('open');
};

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      fileName: 'New Piskel',
      penType: 'pen',
      penSize: 1,
      penColor: '#00ff00',
      bkgPenColor: '#cc0066',
      fps: 12,
      canvasFrames: [{ id: 0, imgURL: '', imgData: '' /* createImageData() */ }],
      pixelsArray: [],
      activeFrame: 0,
      maxId: 0,
      canvasSize: 32,
    };

    this.sizeSelect = this.sizeSelect.bind(this);
    this.colorSelect = this.colorSelect.bind(this);
    this.bkgColorSelect = this.bkgColorSelect.bind(this);
    this.addFrame = this.addFrame.bind(this);
    this.removeFrame = this.removeFrame.bind(this);
    this.moveFrame = this.moveFrame.bind(this);
    this.selectFrame = this.selectFrame.bind(this);
    this.copyFrame = this.copyFrame.bind(this);
    this.addImageToState = this.addImageToState.bind(this);
    this.penSelect = this.penSelect.bind(this);
    this.canvasSizeSelect = this.canvasSizeSelect.bind(this);
    this.fNameChange = this.fNameChange.bind(this);
    this.importFile = this.importFile.bind(this);
  }

  componentDidMount() {
    const state = getSettings();
    if (state) {
      this.setState(state);
    } else {
      const pixels = createPixelsArray(this.state.canvasSize);
      const { pixelsArray } = this.state;
      pixelsArray.push(pixels.map(arr => arr.slice()));
      this.setState({
        pixelsArray,
      });
    }
  }

  sizeSelect(evt) {
    const penSize = parseInt(evt.target.getAttribute('data-size'), 10);
    this.setState({
      penSize,
    });
  }

  colorSelect(evt) {
    const color = evt.target.value;
    this.setState({ penColor: color });
  }

  bkgColorSelect(evt) {
    const color = evt.target.value;
    this.setState({ bkgPenColor: color });
  }

  penSelect(evt) {
    const penType = evt.target.getAttribute('pentype');
    this.setState({
      penType,
    });
  }

  addFrame(e) {
    e.preventDefault();
    const { canvasFrames } = this.state;
    const pixels = createPixelsArray(this.state.canvasSize);
    const { pixelsArray } = this.state;
    pixelsArray.push(pixels.map(arr => arr.slice()));
    let { maxId } = this.state;
    canvasFrames.push({
      id: maxId + 1,
      imgURL: '',
      imgData: '', // createImageData(),
    });
    maxId += 1;
    this.setState({
      canvasFrames,
      maxId,
      pixelsArray,
    });
  }

  removeFrame(e) {
    // e.preventDefault();
    const { canvasFrames } = this.state;
    let { activeFrame } = this.state;
    const { pixelsArray } = this.state;
    if (this.state.canvasFrames.length > 1) {
      const frId = parseInt(e.target.getAttribute('frameid'), 10);
      canvasFrames.splice(frId, 1);
      resetFramesId(canvasFrames);
      pixelsArray.splice(frId, 1);

      if (frId === activeFrame) {
        activeFrame = canvasFrames[0].id;
      }
    }
    this.setState({
      canvasFrames,
      activeFrame,
      maxId: canvasFrames.length - 1,
      pixelsArray,
    });
  }

  copyFrame(e) {
    e.preventDefault();
    const { canvasFrames } = this.state;
    const { pixelsArray } = this.state;
    const frId = parseInt(e.target.getAttribute('frameid'), 10);
    canvasFrames.splice(
      frId + 1,
      0,
      { id: -1, imgURL: canvasFrames[frId].imgURL, imgData: canvasFrames[frId].imgData },
    );
    resetFramesId(canvasFrames);
    pixelsArray.splice(
      frId + 1,
      0,
      pixelsArray[frId].map(arr => arr.slice()),
    );
    this.setState({
      canvasFrames,
      maxId: canvasFrames.length - 1,
      pixelsArray,
    });
  }

  moveFrame(e) {
    e.preventDefault();
    let frId = parseInt(e.target.getAttribute('frameid'), 10);
    const upDown = e.target.getAttribute('id');
    if ((upDown === 'up' && frId > 0) || (upDown === 'down' && frId < this.state.maxId)) {
      const { canvasFrames } = this.state;
      const { pixelsArray } = this.state;
      frId = moveFrame(upDown, canvasFrames, pixelsArray, frId);
      resetFramesId(canvasFrames);
      this.setState({
        activeFrame: frId,
        canvasFrames,
        pixelsArray,
      });
    }
  }

  selectFrame(e) {
    const activeFrame = parseInt(e.target.getAttribute('frameid'), 10);
    this.setState({
      activeFrame,
    });
  }

  addImageToState(id, imgURL, frameURL, pixels) {
    const { canvasFrames } = this.state;
    const { pixelsArray } = this.state;
    const idx = getIndexById(id, canvasFrames);
    canvasFrames[idx].imgURL = imgURL;
    canvasFrames[idx].imgData = frameURL;

    pixelsArray[idx] = pixels.map(arr => arr.slice());

    this.setState({
      canvasFrames,
      pixelsArray,
    });
  }

  canvasSizeSelect(e) {
    // eslint-disable-next-line no-restricted-globals
    const isOKtoReset = confirm('This will RESET your canvas/frames. Are you sure?');
    if (isOKtoReset) {
      const canvasSize = parseInt(e.target.value, 10);
      if (canvasSize !== this.state.canvasSize && canvasSize > 0) {
        const pixels = createPixelsArray(canvasSize);
        const pixelsArray = [pixels.map(arr => arr.slice())];
        const canvasFrames = [{ id: 0, imgURL: '', imgData: '' }];
        this.setState({
          canvasFrames,
          pixelsArray,
          activeFrame: 0,
          maxId: 0,
          canvasSize,
        });
      }
    }
  }

  fNameChange(e) {
    const fileName = e.target.value;
    this.setState({ fileName });
  }

  importFile(evt) {
    const f = evt.target.files[0];
    if (f.name.indexOf('.piskel') >= 0) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const textFile = event.target;
        const state = JSON.parse(textFile.result);
        this.setState(state);
        this.setState({
          activeFrame: 0,
        });
      });
      reader.readAsText(f);
    }
  }

  render() {
    return (
      <div className ='app-container'>
        <div className='fs-wrapper'>
          <div className='fullscreen'>
            <button onClick={closeFS}>Close</button>
          </div>
        </div>

        <Header name = {this.state.fileName}/>
        <div className = 'workspase'>
          <Palette
            pen = {this.state.penType}
            penColor = {this.state.penColor}
            bkgPenColor = {this.state.bkgPenColor}
            penSelect = {this.penSelect}
            penSize = {this.state.penSize}
            sizeSelect = {this.sizeSelect}
            colorSelect = {this.colorSelect}
            bkgColorSelect = {this.bkgColorSelect}
            canvasFrames = {this.state.canvasFrames}
            activeFrame = {this.state.activeFrame}
            selectFrame = {this.selectFrame}
            copyFrame = {this.copyFrame}
            moveFrame = {this.moveFrame}
            addFrame = {this.addFrame}
            removeFrame = {this.removeFrame}
          />

          <div className='canvas-wrapper'>
            <Canvas
              penSize = {this.state.penSize}
              penColor = {this.state.penColor}
              bkgPenColor = {this.state.bkgPenColor}
              penType = {this.state.penType}
              activeFrame = {this.state.activeFrame}
              addImageToState = {this.addImageToState}
              sideSize = {this.state.canvasSize}
              pixelsArray = {this.state.pixelsArray}
            />
            <div className='info'></div>
          </div>
          <div className='tools'>
            <Player frames = {this.state.canvasFrames} size = {this.state.canvasSize}/>
            <FileManager
              state = {this.state}
              sizeSelect = {this.canvasSizeSelect}
              fNameChange = {this.fNameChange}
              importFile = {this.importFile}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
