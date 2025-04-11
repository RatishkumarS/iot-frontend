import React, { useState } from 'react';
import io from 'socket.io-client';
import './ControlsPage.css'; 
import fan from './images/fan.png';

// Connecting to  backend server.js through sockets
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');

//total control logic is as below
function ControlsPage() {
  // we initialize with false for off for both fan and led
  const [fanState, setFanstate] = useState(false);
  const [ledState, setLedstate] = useState(false);
  // setting automatic control to be true initially which means manual is false
  const [autoControl, setAutoCtrl] = useState(true);

  // Toggling fan state in UI if manual control is enabled
  const fanToggle = () => {
    if (!autoControl) {
      const newFanstate = !fanState;
      setFanstate(newFanstate);
      // we are emiting the fan status as a JSON object
      socket.emit('control_update', { fan: { status: newFanstate ? 'on' : 'off' } });
    }
  };

  // Toggling LED if manual control is enabled
  const ledToggle = () => {
    if (!autoControl) {
      const newLedstate = !ledState;
      setLedstate(newLedstate);
      // we are emiting the LED  status as a JSON object
      socket.emit('control_update', { led: { status: newLedstate ? 'on' : 'off' } });
    }
  };

  // Toggling automatic climate control.
  // When enabling automatic control,both fan and led should be off
  const autocontrolToggle = () => {
    const newAutocontrol = !autoControl;
    setAutoCtrl(newAutocontrol);
    // we now, emit the control mode as a JSON object (automatic or manual)
    socket.emit('control_update', { control: { status: newAutocontrol ? 'automatic' : 'manual' } });

    // If automatic control is enabled, we should turn off fan and LED immediately.
    if (newAutocontrol) {
      if (fanState) {
        setFanstate(false);
        socket.emit('control_update', { fan: { status: 'off' } });
      }
      if (ledState) {
        setLedstate(false);
        socket.emit('control_update', { led: { status: 'off' } });
      }
    }
  };

  return (
    <div className="out-box">
      <header className="header">
        <h1 className="control-title">Smart Home Control Panel</h1>
        <p style={{ fontFamily: 'cursive' }}>Manage your home devices effortlessly</p>
      </header>
      
      <div className="boxs-content">
        <div className="auto-box">
          <button className="auto-btn" onClick={autocontrolToggle}>
            {autoControl ? 'Disable' : 'Enable'} Automatic Climate Control
          </button>
        </div>
        <div className="ctrl">
          {/* for fan button */}
          <button className="ctrl-btn" onClick={fanToggle} disabled={autoControl}>
            <div className="fan-box">
              <img 
                src={fan}
                alt="Fan Blades" 
                className={`fan-bladz ${fanState ? 'rotate' : ''}`}
              />
            </div>
            <span>Fan: {fanState ? 'On' : 'Off'}</span>
          </button>
          {/* for light button */}
          <button className="ctrl-btn" onClick={ledToggle} disabled={autoControl}>
            <img 
              src="https://img.icons8.com/fluency/96/000000/light-on.png" 
              alt="Light Icon" 
              className={`icon light-icon ${ledState ? 'glow' : ''}`}
            />
            <span>Light: {ledState ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlsPage;