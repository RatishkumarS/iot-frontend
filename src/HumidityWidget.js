import React from 'react';
import './HumidityWidget.css';

function HumidityWidget({ humidity }) {
  //we are etting headers, animation and display for humidity by using a ref image in the mentioned url
  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
        Humidity
      </h3>
    <div className="humidity-comp">
      <div className="humidity-dynamic">
        <img 
          src="https://img.icons8.com/color/96/000000/water.png" 
          alt="Water Droplet" 
          className="water-droplet"
        />
      </div>
      <p style={{ fontSize: '2rem' }}>{humidity}%</p>
    </div>
    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
      </div>
    </div>
  );
}

export default HumidityWidget;
