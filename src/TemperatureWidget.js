import React from 'react';
import './TemperatureWidget.css';

function TemperatureWidget({ temperature }) {
  // set scaling for the incoming temperature value between 0 to 100
  const setScaledtemp = Math.min(Math.max(temperature, 0), 100);
  const mHeight = setScaledtemp + '%';//append with a %
  
  // setting the thresholds for the temperature color notification
  let setBarcolor;
  if (setScaledtemp < 33) {
    setBarcolor = "#00aaff"; // Blue for cold temps
  } else if (setScaledtemp < 80) {
    setBarcolor = "#00cc66"; // Green for moderate temps
  } else {
    setBarcolor = "#ff3300"; // Red for hot temps
  }

  return (
    <div className="temp-comp">
      <h3 className="temp-title">Temperature</h3>
      <div className="widget">
        <div
          className="widget-fill"
          style={{
            height: mHeight,
            backgroundColor: setBarcolor,
          }}
        />
        <div className="widget-label">
          {temperature} F
        </div>
      </div>
      <div style={{ marginTop: '35px', fontWeight: 'bold' }}>
      </div>
    </div>
  );
}

export default TemperatureWidget;
