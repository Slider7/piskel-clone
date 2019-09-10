import React from 'react';
import './palette.css';
import PenSizer from './pen-sizer/pen-sizer.jsx';
import Brushes from './brushes/brushes.jsx';
import FrameList from './frames-list/frames-list.jsx';

class Palette extends React.Component {
  render() {
    return (
      <div className = 'palette'>
        <div className = 'brushes-wrapper'>
          <PenSizer penSize = {this.props.penSize} sizeSelect={this.props.sizeSelect} />
          <Brushes
            penType = {this.props.pen}
            penSelect = {this.props.penSelect}
          />
          <div className='colors'>
            <input type='color' value = {this.props.bkgPenColor} name='color2' className='color-selector2' onChange = {this.props.bkgColorSelect}/>
            <input type='color' value = {this.props.penColor} name='color1' className='color-selector1' onChange = {this.props.colorSelect}/>
          </div>
        </div>
        <div className = 'frames-wrapper'>
          <FrameList
            frames = {this.props.canvasFrames}
            removeFrame = {this.props.removeFrame}
            selectFrame = {this.props.selectFrame}
            activeFrame = {this.props.activeFrame}
            copyFrame = {this.props.copyFrame}
            moveFrame = {this.props.moveFrame}
          />
          <button className='btn' onClick = {this.props.addFrame}>Add frame</button>
        </div>
      </div>
    );
  }
}

export default Palette;
