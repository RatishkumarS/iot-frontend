import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import socketIOClient from 'socket.io-client';

const endpoint = process.env.REACT_APP_API_URL || "http://localhost:3000";

function FanChart() {
  // here we load initial chart data from localStorage
  const [c, setChart] = useState(() => {
    const s = localStorage.getItem('fanChartData');
    return s ? JSON.parse(s) : {
      labels: [],
      datasets: [{
        label: 'Fan State (On=1, Off=0)',
        data: [],
        fill: false,
        backgroundColor: 'purple',
        borderColor: 'purple',
      }]
    };
  });

  useEffect(() => {
    //initiating socket connection to fan topic and checking on/off
    const socket = socketIOClient(endpoint, { transports: ["websocket"] });
    socket.on('mqtt_message', (data) => {
      if (data.topic === 'sensors/fan') {
        try {
          const dataObj = JSON.parse(data.message);
          const state = dataObj.status;
          const refState = state === 'on' ? 1 : 0;// changing on/off to 1/0
          const cTime = new Date().toLocaleTimeString();
          setChart(prevData => {
            const newLabels = prevData.labels.concat(cTime);
            const newData = prevData.datasets[0].data.concat(refState);
            // Keeping  only the last 10 data points      
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
            localStorage.setItem('fanChartData', JSON.stringify(charts));
            return charts;
          });
        } catch (error) {
          console.error("Error parsing fan state data", error);
        }
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h5>Fan State vs. Time</h5>
      <Line data={c} />
    </div>
  );
}

export default FanChart;
