import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function TemperatureChart() {
  // Load initial chart data from localStorage or use empty data
  const [c, setChart] = useState(() => {
    const s = localStorage.getItem('temperatureChartData');
    return s ? JSON.parse(s) : {
      labels: [],
      datasets: [{
        label: 'Temperature (F)',
        data: [],
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
      }]
    };
  });

  useEffect(() => {
    // Connect to the Websockets to retrive temp data
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    // Listen for MQTT messages for temperature
    socket.on('mqtt_message', (data) => {
      if (data.topic === 'sensors/temperature') {
        try {
          //parse the temperature value from the json and use it with t
          const dataObj = JSON.parse(data.message);
          const t = parseFloat(dataObj.temperature);
          if (!isNaN(t)) {
            // We use current time as label for the chart
            const cTime = new Date().toLocaleTimeString();
            //concating the new labels with the new data
            setChart(prevData => {
              const newLabels = prevData.labels.concat(cTime);
              const newData = prevData.datasets[0].data.concat(t);
              
              // Limit to last 10 data points by appending 
              // splicing the last 10 readings(labels,data) starting from 0th index on every iteration
              if (newLabels.length > 10) {
                newLabels.splice(0, newLabels.length - 10);
                newData.splice(0, newData.length - 10);
              }

              // Maintain a new object to overide the new data into chart data
              const charts = {
                labels: newLabels,
                datasets: [
                  Object.assign({}, prevData.datasets[0], { data: newData })
                ]
              };
              
              localStorage.setItem('temperatureChartData', JSON.stringify(charts));
              return charts;
            });
          }
        } catch (error) {
          console.error("Error parsing temperature data", error);
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h5>Temperature vs. Time</h5>
      <Line data={c} />
    </div>
  );
}

export default TemperatureChart;
