import React from 'react';
import './brushes.css';

function Pen(props) {
  const x = props.spriteXY[0];
  const y = props.spriteXY[1];
  const style = {
    backgroundPosition: `${x}px ${y}px`,
  };
  let selClass = 'pen';
  if (props.penType === props.brush) {
    selClass += ' selected';
  }
  return (
    <div style = {style} className = {selClass} pentype = {props.brush}></div>
  );
}

export default Pen;
