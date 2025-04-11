import React, { useEffect, useRef, useState } from 'react';
import './FanWidget.css';

function FanWidget({ status, percent }) {
  const [rotation, setRotation] = useState(0);
  const speedRef = useRef(360); // Full speed in degrees per second
  const requestRef = useRef();// We use useRef for persisting new values
  const prevTimeref = useRef();
  const statusRef = useRef(status);

  // We update statusRef and reset speed when fan turns on.
  useEffect(() => {
    statusRef.current = status;
    if (status === 'on') {
      speedRef.current = 360;
    }
  }, [status]);

  // animation logic
  const animate = (time) => {
    if (prevTimeref.current != null) {
      const deltaTime = time - prevTimeref.current;
      //We update rotation based on the current speed.
      setRotation((prevRotation) => (prevRotation + speedRef.current * (deltaTime / 1000)) % 360);
      
      // for gradually deceleration when fan turns off when reduce it gradually by a factor of 0.98 and then we make it as 0 when speed is less than 1
      if (statusRef.current === 'off') {
        speedRef.current = speedRef.current * 0.98;
        if (speedRef.current < 1) {
          speedRef.current = 0;
        }
      }
    }
    //setting the new times
    prevTimeref.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  // Start the animation loop once on initialization.
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="fan-comp">
      <h3 className="fan-title">Fan Status</h3>
      <div className="fan-data">
        <div
          className="fan"
          style={{ transform: `rotate(${rotation}deg)` }}  // for animation
        >
          {/* using Salable Vector graphics from xml to do graphics for fan display */}
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* animation for outer circle */}
            <circle cx="60" cy="60" r="55" stroke="#333" strokeWidth="4" fill="none" />
            {/* animation for fan blades */}
            <g fill="#ccc" stroke="#333" strokeWidth="1">
              {/* blade template formatting*/}
              <g id="blade">
                <path d="M60,60 L60,20 A20,20 0 0,1 80,40 Z" />
              </g>
              {/* now rotate the blade for  blade wings */}
              <use href="#blade" transform="rotate(0,60,60)" />
              <use href="#blade" transform="rotate(90,60,60)" />
              <use href="#blade" transform="rotate(180,60,60)" />
              <use href="#blade" transform="rotate(270,60,60)" />
            </g>
            {/* Center pole */}
            <circle cx="60" cy="60" r="5" fill="#333" />
          </svg>
        </div>
        <div className="fan-state">
          {status.toUpperCase()} 
        </div>
        <div className="fan-percent">
          Usage: {percent}%
        </div>
      </div>
      <div style={{ marginTop: '50px', fontWeight: 'bold' }}>
      </div>
    </div>
  );
}

export default FanWidget;