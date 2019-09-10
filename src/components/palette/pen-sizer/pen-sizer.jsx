import React from 'react';
import './pen-sizer.css';

function SizeButton(props) {
  let selShadow = '';
  if (props.selected) selShadow = ', 0 0 2px 2px rgb(204, 0, 102)';
  const style = {
    boxShadow: `inset 0 0 1px calc(10px - ${props.size}px) rgb(20, 25, 25) ${selShadow}`,
  };
  return <button style = {style} className = 'sizeBtn'
           onClick= {props.sizeSelect} data-size= {Math.round(props.size / 2)}>
         </button>;
}

function PenSizer(props) {
  return (
    <div className = 'pen-size'>
      <p>Pen size</p>
      <SizeButton selected = {props.penSize === 1} size = {2} sizeSelect = {props.sizeSelect} />
      <SizeButton selected = {props.penSize === 2} size = {4} sizeSelect = {props.sizeSelect} />
      <SizeButton selected = {props.penSize === 3} size = {6} sizeSelect = {props.sizeSelect} />
      <SizeButton selected = {props.penSize === 4} size = {8} sizeSelect = {props.sizeSelect} />
    </div>
  );
}

export default PenSizer;
