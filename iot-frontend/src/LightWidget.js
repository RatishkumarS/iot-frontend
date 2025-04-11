import React from 'react';
import './LightWidget.css';
// we import the saved bulb images from images folder 
import bulbOff from './images/bulb_off.jpg';
import bulbOn from './images/bulb_on.jpg';

function LightWidget({ status, percent }) {
  // checking if the light is on 
  const isOn = typeof status === 'string' ? status.toLowerCase() === 'on' : false;

  return (
    <div className="light-comp">     
     <h3 className="heading">Light Status</h3>
    <div className="light-widget">
      {/* Checking if the status is on/off and calling the relevant bulb image from the imports */}
      <img
        src={isOn ? bulbOn : bulbOff}
        alt="Light Bulb"
        className={`bulb-img ${isOn ? 'glow' : ''}`}
      />
      <p className="light-status">{isOn ? 'On' : 'Off'}</p>
      <p className="light-percent">Usage: {percent}%</p>
    </div>
    </div>
  );
}

export default LightWidget;
