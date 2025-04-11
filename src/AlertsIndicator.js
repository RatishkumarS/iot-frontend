import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './AlertsIndicator.css'; 

// We mainly use this to create a Alert indicator to the user when temp/ldr/humidity exceeds a certain threshold. 
// We connect to backend server to get the data from the topics
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');



function AlertsIndicator() {
  const [blink, setBlink] = useState(false);
  const [showTable, setAlertstable] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handleAlert = (data) => {
      console.log("Received mqtt_message event:", data);
      
      //checking the alert topics then parsing the topics to get the status value from the json
      if (
        data.topic === 'Alert_temp' ||
        data.topic === 'Alert_humidity' ||
        data.topic === 'Alert_darkness'
      ) {
        let alerts = '';
        try {
          // Try parsing the JSON payload, e.g., {"status": "on"}
          const parsed = JSON.parse(data.message);
          if (parsed.status) {
            alerts = parsed.status.toLowerCase();
          }
        } catch (e) {
          console.warn(`Could not parse the JSON for the topic ${data.topic}: ${e.message}`);
          alerts = data.message.toLowerCase();
        }
        console.log(`Parsed alert status successfully for ${data.topic}: ${alerts}`);
        
        // If the alert status is turned "on", trigger the blinking in Alerts on Navbar
        if (alerts === 'on') {
          //if there is another alert in short interval after the user clicks the alert link then again it should start blik in 50ms
          setBlink(false);
          setTimeout(() => {
            setBlink(true);
          }, 50);
        }
      }
    };

    // Listen to the mqtt_message which has the Alert data...
    socket.on('mqtt_message', handleAlert);
    return () => {
      socket.off('mqtt_message', handleAlert);
    };
  }, []);

  const handleClick = async () => {
    //on the alert click in navbar by user the blink should stop and a prop with Alerts table records should be displayed
    setBlink(false);
    setAlertstable(true);
    try {
      // parsing the alert records in the json response into a data variable
      const response = await fetch('http://localhost:3000/alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // close the prop on X click in UI
  const closeModal = () => {
    setAlertstable(false);
  };

  // There is a clear alerts button feature where the button click initiates a post request to clear the alertsrecord array with all alert records
  const handleClearAlerts = async () => {
    try {
      const response = await fetch('http://localhost:3000/clear_alerts', {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data.message);
      setAlerts([]);
    } catch (error) {
      console.error('Error clearing the alerts:', error);
    }
  };

  const modalContent = (
    <div className="custom" onClick={closeModal}>
      <div className="custom-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={closeModal}>X</button>
        <h2>Alert Records</h2>
        <table>
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Value</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.sensor}</td>
                  <td>{alert.value}</td>
                  <td>{alert.date}</td>
                  <td>{alert.time}</td>
                  <td>{alert.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No alerts available.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <button className="clear" onClick={handleClearAlerts}>Clear Alerts</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <span 
        onClick={handleClick} 
        className={blink ? 'blink-alert' : ''} 
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        Alerts
      </span>
      {showTable && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
}

export default AlertsIndicator;