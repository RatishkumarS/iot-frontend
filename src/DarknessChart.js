import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

// Use environment variable for the endpoint, fallback to localhost for development
const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function DarknessChart() {
  // Initialize chart data from localStorage; update state when new sensor data is received
  const [c, setChart] = useState(() => {
    const s = localStorage.getItem('darknessChartData');
    return s
      ? JSON.parse(s)
      : {
          labels: [],
          datasets: [{
            label: 'Darkness',
            data: [],
            fill: false,
            backgroundColor: 'black',
            borderColor: 'black',
          }]
        };
  });

  // Connect to the backend server through websockets and update chart data on incoming sensor readings.
  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    socket.on('mqtt_message', (data) => {
      if (data.topic === 'sensors/ldr') {
        try {
          const dataObj = JSON.parse(data.message);
          const d = parseFloat(dataObj.darkness);
          if (!isNaN(d)) {
            const darkValue = d; // sensor darkness value (a decimal between 0 and 1)
            const cTime = new Date().toLocaleTimeString();

            setChart(prevData => {
              const newLabels = [...prevData.labels, cTime];
              const newData = [...prevData.datasets[0].data, darkValue];
              // Keep only the last 10 data points.
              if (newLabels.length > 10) {
                newLabels.splice(0, newLabels.length - 10);
                newData.splice(0, newData.length - 10);
              }
              const charts = {
                labels: newLabels,
                datasets: [
                  { ...prevData.datasets[0], data: newData }
                ]
              };
              // Save the updated chart data to localStorage.
              localStorage.setItem('darknessChartData', JSON.stringify(charts));
              return charts;
            });
          }
        } catch (error) {
          console.error("Error parsing LDR sensor data", error);
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h5>Darkness vs. Time</h5>
      <Line data={c} />
    </div>
  );
}

export default DarknessChart;
