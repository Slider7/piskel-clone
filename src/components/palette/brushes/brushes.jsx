import React from 'react';
import './brushes.css';
import Pen from './pen.jsx';

function Brushes(props) {
  return (
    <div className = 'brushes' onClick={props.penSelect}>
      <Pen brush = 'pen' penType = {props.penType} spriteXY = {[-182, -92]} />
      <Pen brush = 'line' penType = {props.penType} spriteXY = {[-46, -136]} />
      <Pen brush = 'bucket' penType = {props.penType} spriteXY = {[-228, -92]} />
      <Pen brush = 'rectangle' penType = {props.penType} spriteXY = {[-182, 0]} />
      <Pen brush = 'circle' penType = {props.penType} spriteXY = {[-228, -46]} />
      <Pen brush = 'eraser' penType = {props.penType} spriteXY = {[-46, -228]} />
    </div>
  );
}

export default Brushes;
