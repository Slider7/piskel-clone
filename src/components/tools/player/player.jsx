import React from 'react';
import './player.css';

class Player extends React.Component {
  constructor() {
    super();
    this.state = {
      speed: 12,
      fullScreen: false,
    };
    this.preparedFrames = [];
    this.currFrame = 0;
    this.resetAnimation = this.resetAnimation.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.play = this.play.bind(this);
    this.showFullScreen = this.showFullScreen.bind(this);
  }

  resetAnimation(speed) {
    clearInterval(this.intervalId);
    this.currFrame = 0;
    if (speed) {
      this.intervalId = setInterval(this.play, Math.round(1000 / speed));
    }
  }

  changeSpeed(evt) {
    let speed = this.state;
    if (evt.target.value > 0) {
      speed = evt.target.value;
      this.resetAnimation(speed);
    } else {
      speed = 0;
      clearInterval(this.intervalId);
    }
    this.setState({
      speed,
    });
    document.querySelector('#speed').value = this.state.speed;
  }

  play() {
    this.screenView.style['background-image'] = this.preparedFrames[this.currFrame];
    if (this.state.fullScreen) {
      document.querySelector('.fullscreen').style['background-image'] = this.preparedFrames[this.currFrame];
    }
    if (this.currFrame < this.preparedFrames.length - 1) {
      this.currFrame += 1;
    } else this.currFrame = 0;
  }

  componentDidMount() {
    this.preparedFrames = [`url('${this.props.frames[0].imgURL}')`];
    this.resetAnimation(this.state.speed);
  }

  componentWillReceiveProps(nextProps) {
    const result = nextProps.frames.map(
      frame => `url('${frame.imgURL}')`,
    );
    this.preparedFrames = result;
    this.screenView = document.querySelector('#animation-view');
    this.screenView.style.width = `${this.props.size}px`;
    this.screenView.style.height = `${this.props.size}px`;
  }

  showFullScreen() {
    document.querySelector('.fs-wrapper').classList.toggle('open');
    this.setState({
      fullScreen: true,
    });
  }

  render() {
    return (
      <div className="player">
        <div className = 'anim-wrapper'>
          <div id="animation-view">
          </div>
        </div>
        <div className="fps-control">
          <label id='speed-label'>FPS: {this.state.speed}</label>
          <input type="range" value={this.state.speed} id="speed" min="0" max="24" onChange={this.changeSpeed} />
          <button onClick={this.showFullScreen}>FullScreen</button>
        </div>
      </div>
    );
  }
}

export default Player;
