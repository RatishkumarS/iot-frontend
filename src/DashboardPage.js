import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
// imports for Widgets
import TemperatureWidget from './TemperatureWidget';
import FanWidget from './FanWidget';
import DarknessWidget from './DarknessWidget';
import HumidityWidget from './HumidityWidget';
import LightWidget from './LightWidget';
// imports for charts
import TemperatureChart from './TemperatureChart';
import FanChart from './FanChart';
import DarknessChart from './DarknessChart';
import HumidityChart from './HumidityChart';
import LightStateChart from './LightStateChart';
// import for styling
import './DashboardPage.css';

const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function DashboardPage() {

  //Using useState hook to get the latest temperature from the localstorage and persisting them by parsing its float value
  const [temperature, setTemperature] = useState(() => {
    const s = localStorage.getItem('temperature');
    return s ? parseFloat(s) : 0;
  });

  //Using useState hook to get the latest fan status from the localstorage and persisting them
  const [fanStatus, setFanstatus] = useState(() => localStorage.getItem('fanStatus') || 'off');

  //Using useState hook to get the latest darkness value from ldr sensor and get data from the localstorage and persisting them
  const [darkness, setDarkness] = useState(() => {
    const s = localStorage.getItem('darkness');
    return s ? parseFloat(s) : 0;
  });

  //Using useState hook to get the latest humidity from the localstorage and persisting them by parsing its float value
  const [humidity, setHumidity] = useState(() => {
    const s = localStorage.getItem('humidity');
    return s ? parseFloat(s) : 0;
  });

  //Using useState hook to get the latest light status from the localstorage and persisting them
  const [lightStatus, setLightstatus] = useState(() => localStorage.getItem('lightStatus') || 'off'); 

  //Using useState hook to get the latest fan percentage value from the localstorage and persisting them by parsing its float value
  const [fanPercent, setFanpercent] = useState(() => {
    const s = localStorage.getItem('fanPercent');
    return s ? parseFloat(s) : 0;
  });

  //Using useState hook to get the latest light percent from the localstorage and persisting them by parsing its float value
  const [lightPercent, setLightpercent] = useState(() => {
    const s = localStorage.getItem('lightPercent');
    return s ? parseFloat(s) : 0;
  });


  //We used useEffect for handing the initialization and proper closing after each component
  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    // We initiated socket connection to gather the data from the topics as soon the component is rendered
    socket.on('connect', () => {
      console.log('Connected to WebSocket with id:', socket.id);
    });

    // Here the socket receive the mqtt-message with a json body with all the latest topic reading from the backend server.js 
    socket.on('mqtt_message', (data) => {
      console.log('Received mqtt_message from backend server.js:', data);

      // Temperature topic- parsing json and getting the data for the temperature with parseFloat and setting them up in localStorage
      if (data.topic === 'sensors/temperature') {
        try {
          const dataObject = JSON.parse(data.message);
          const tempValue = parseFloat(dataObject.temperature);
          if (!isNaN(tempValue)) {
            setTemperature(tempValue);
            localStorage.setItem('temperature', tempValue);
          }
        } catch (err) {
          console.error('Error parsing temperature:', err);
        }
      }

      // fan topic- parsing json and getting the data for the fan status with parse(since its just on/off string) and setting them up in localStorage
      if (data.topic === 'sensors/fan') {
        try {
          const dataObject = JSON.parse(data.message);
          const status = dataObject.status;
          if (status === 'on' || status === 'off') {
            setFanstatus(status);
            localStorage.setItem('fanStatus', status);
          }
        } catch (err) {
          console.error('Error parsing fan status:', err);
        }
      }

      // ldr topic- parsing json and getting the data for the darkness key from the json with parseFloat and setting them up in localStorage
      if (data.topic === 'sensors/ldr') {
        try {
          const dataObject = JSON.parse(data.message);
          const darkValue = parseFloat(dataObject.darkness);
          if (!isNaN(darkValue)) {
            setDarkness(darkValue);
            localStorage.setItem('darkness', darkValue);
          }
        } catch (err) {
          console.error('Error parsing darkness value:', err);
        }
      }

      // humidity topic- parsing json and getting the data for the humidity with parseFloat and setting them up in localStorage
      if (data.topic === 'sensors/humidity') {
        try {
          const dataObject = JSON.parse(data.message);
          const humidValue = parseFloat(dataObject.humidity);
          if (!isNaN(humidValue)) {
            setHumidity(humidValue);
            localStorage.setItem('humidity', humidValue);
          }
        } catch (err) {
          console.error('Error parsing humidity:', err);
        }
      }

      // light topic- parsing json and getting the status for the light with status key and setting them up in localStorage
      if (data.topic === 'sensors/light') {
        try {
          const dataObject = JSON.parse(data.message);
          const status = dataObject.status;
          if (status === 'on' || status === 'off') {
            setLightstatus(status);
            localStorage.setItem('lightStatus', status);
          }
        } catch (err) {
          console.error('Error parsing light status:', err);
        }
      }

      // fan_usage_percentage topic- parsing json and getting the data for the percentage with parseFloat and setting them up in localStorage
      if (data.topic === 'fan_usage_percentage') {
        try {
          const dataObject = JSON.parse(data.message);
          const fanPct = parseFloat(dataObject.percentage);
          if (!isNaN(fanPct)) {
            setFanpercent(fanPct);
            localStorage.setItem('fanPercent', fanPct);
          }
        } catch (err) {
          console.error('Error parsing fan usage percentage:', err);
        }
      }

       // light_usage_percentage topic- parsing json and getting the data for the percentage with parseFloat and setting them up in localStorage
      if (data.topic === 'light_usage_percentage') {
        try {
          const dataObject = JSON.parse(data.message);
          const lightPct = parseFloat(dataObject.percentage);
          if (!isNaN(lightPct)) {
            setLightpercent(lightPct);
            localStorage.setItem('lightPercent', lightPct);
          }
        } catch (err) {
          console.error('Error parsing light usage percentage:', err);
        }
      }
    });

    // we are providing a if block to handle all the NaN values just in case if the sensors burn out or any other issue occurs
    // we gracefully disconnect from the websocket connection
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => socket.disconnect();
  }, []); // Empty dependency array: run once on initialization

  return (
    <div className="db-box">
      <h1 className="db-title">Home Controls</h1>
        <div className="box-div">
          <div className="widget-box">
              {/* We made two components in one widget-box one for displaying the sensor readings and other for char */}
            {/*  for temperature widget */}
            <div className="widget-comp">
              <TemperatureWidget temperature={temperature} />
              <div className="chart-comp">
                <TemperatureChart />
              </div>
            </div>

            {/* for fan widget */}
            <div className="widget-comp">
              <FanWidget status={fanStatus} percent={fanPercent} />
              <div className="chart-comp">
                <FanChart />
              </div>
            </div>

            {/* for darkness widget */}
            <div className="widget-comp">
              <DarknessWidget darkness={darkness} />
              <div className="chart-comp">
                <DarknessChart />
              </div>
            </div>

            {/* for humidity widget */}
            <div className="widget-comp">
              <HumidityWidget humidity={humidity} />
              <div className="chart-comp">
                <HumidityChart />
              </div>
            </div>

            {/* for light widget */}
            <div className="widget-comp">
              <LightWidget status={lightStatus} percent={lightPercent} />
              <div className="chart-comp">
                <LightStateChart />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
