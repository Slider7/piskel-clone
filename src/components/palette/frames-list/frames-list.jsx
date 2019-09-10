import React from 'react';
import './frame-list.css';

const drawCanvasFromProps = (id, img) => {
  const canvasId = `#canvas${id}`;
  const currFrameCanvas = document.querySelector(canvasId);
  currFrameCanvas.style['background-image'] = img;
};

class Frame extends React.Component {
  componentDidMount() {
    drawCanvasFromProps(this.props.id, this.props.imgData);
  }

  componentDidUpdate() {
    drawCanvasFromProps(this.props.id, this.props.imgData);
  }

  render() {
    let selClass = 'frame-border';
    let btnClass = 'frame-buttons';
    if (this.props.activeFrame === this.props.id) {
      selClass += ' active-frame';
      btnClass += ' active';
    }

    return (
    <div id={`frame${this.props.id}`} className = {selClass}>
      <canvas onClick={this.props.selectFrame}
        className = 'frame-canvas'
        id = {`canvas${this.props.id}`}
        frameid = {this.props.id}
        width = {96}
        height = {96}
        />
      <div className={btnClass}>
        <button id='delBtn' onClick={this.props.removeFrame} frameid = {this.props.id}></button>
        <button id='up' onClick={this.props.moveFrame} frameid = {this.props.id}></button>
        <button id='down' onClick={this.props.moveFrame} frameid = {this.props.id}></button>
        <button id='copyBtn' onClick={this.props.copyFrame} frameid = {this.props.id}></button>
      </div>
    </div>);
  }
}

function FrameList(props) {
  const frmList = props.frames.map(
    frame => <Frame
      key = {frame.id}
      id = {frame.id}
      imgURL = {frame.imgURL}
      imgData = {frame.imgData}
      removeFrame = {props.removeFrame}
      selectFrame = {props.selectFrame}
      copyFrame = {props.copyFrame}
      moveFrame = {props.moveFrame}
      activeFrame = {props.activeFrame} />,
  );
  return (
    <div className = 'frame-list'>
      {frmList}
    </div>
  );
}

export default FrameList;
