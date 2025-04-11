import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import ControlsPage from './ControlsPage';
import AlertsIndicator from './AlertsIndicator';
import NavBar from './NavBar';
import './RegisterChartComponent'; 

// We are using react-router to route between different elements. Since we have to display(dashboard), control the devices(/controls) and see the alerts when the threshold exceeds(/alerts).
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
         <Route path="/" element={<DashboardPage />} /> {/*Routes to dashboard where all the sensors readings are showwn*/}
         <Route path="/controls" element={<ControlsPage />} /> {/*Routes to controls where all the sensors  are controlled between automatic and manual modes*/}
         <Route path="/alerts" element={<AlertsIndicator />} />{/*Routes to alerts where all the alerts are showwn*/}
      </Routes>
    </Router>
  );
}

export default App;
