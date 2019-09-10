import React from 'react';
import './header.css';
import logoIcon from './images/piskel-logo.png';

function Header(props) {
  return (
    <div className = 'main-header'>
      <div className='logo'>
        <img className='logo' src={logoIcon}/>
        <span>CLONE</span>
      </div>
      <span>{props.name}</span>
      <div className='header-buttons'>
      </div>
    </div>
  );
}

export default Header;
