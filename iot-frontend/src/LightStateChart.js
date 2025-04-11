import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function LightStateChart() {
  // we are loading initial chart data from localStorage
  const [c, setChart] = useState(() => {
    const s = localStorage.getItem('lightChartData');
    return s ? JSON.parse(s) : {
      labels: [],
      datasets: [{
        label: 'Light State (On=1, Off=0)',
        data: [],
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      }]
    };
  });

  //initializing connetion to sockets
  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    //seeking mqtt-message for light topic
    socket.on('mqtt_message', (data) => {
      if (data.topic === 'sensors/light') {
        try {
          const dataObj = JSON.parse(data.message);
          // changing light status to 1 (on) or 0 (off)
          const status = dataObj.status === 'on' ? 1 : 0;
          // Get the current time label for the x-axis
          const cTime = new Date().toLocaleTimeString();
          setChart(prevData => {
            const newLabels = prevData.labels.concat(cTime);
            const newData = prevData.datasets[0].data.concat(status);
            // Keeping only the last 10 data points
            if (newLabels.length > 10) {
              newLabels.splice(0, newLabels.length - 10);
              newData.splice(0, newData.length - 10);
            }
            // Creating an updated chart data object
            const charts = {
              labels: newLabels,
              datasets: [
                Object.assign({}, prevData.datasets[0], { data: newData })
              ]
            };
            // Persisting the updated chart data in localStorage
            localStorage.setItem('lightChartData', JSON.stringify(charts));
            return charts;
          });
        } catch (error) {
          console.error("Error parsing light status data", error);
        }
      }
    });

    return () => socket.disconnect();
  }, []);// runs only once on initialization as we set dependency array to be empty

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h5>Light State vs. Time</h5>
      <Line data={c} />
    </div>
  );
}

export default LightStateChart;