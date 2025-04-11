import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

// endpoint for Socket.IO server
const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function HumidityChart() {
  // we are loading initial chart data from localStorage 
  const [c, setChart] = useState(() => {
    const s = localStorage.getItem('humidityChartData');
    return s ? JSON.parse(s) : {
      labels: [],
      datasets: [{
        label: 'Humidity (%)',
        data: [],
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      }]
    };
  });

  //initialing connection to socket
  useEffect(() => {
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });

    // we listen to MQTT messages for humidity
    socket.on('mqtt_message', (data) => {
      if (data.topic === 'sensors/humidity') {
        try {
          const dataObj = JSON.parse(data.message);
          const hval = parseFloat(dataObj.humidity);
          if (!isNaN(hval)) {
            const cTime = new Date().toLocaleTimeString();
            setChart(prevData => {
              const newLabels = prevData.labels.concat(cTime);
              const newData = prevData.datasets[0].data.concat(hval);
              // Keeping only the last 10 data points
              if (newLabels.length > 10) {
                newLabels.splice(0, newLabels.length - 10);
                newData.splice(0, newData.length - 10);
              }
              //updating the chart data 
              const charts = {
                labels: newLabels,
                datasets: [
                  Object.assign({}, prevData.datasets[0], { data: newData })
                ]
              };
              localStorage.setItem('humidityChartData', JSON.stringify(charts));
              return charts;
            });
          }
        } catch (error) {
          console.error("Error parsing humidity data", error);
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h5>Humidity vs. Time</h5>
      <Line data={c} />
    </div>
  );
}

export default HumidityChart;
