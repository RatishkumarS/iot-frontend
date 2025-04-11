import React from 'react';
import { Link } from 'react-router-dom';
import AlertsIndicator from './AlertsIndicator';

// we use react router for routing to different parts of the application
function NavBar() {
  return (
    <nav style={{
      backgroundColor: '#333',
      color: '#fff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
        Smart Home Hub
      </div>
      <div>
        <Link to="/" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/controls" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
          Controls
        </Link>
        <AlertsIndicator />
      </div>
    </nav>
  );
}

export default NavBar;
