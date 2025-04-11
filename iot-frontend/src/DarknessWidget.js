import React from 'react';
import './DarknessWidget.css';

function DarknessWidget({ darkness }) {
  // scaling the darkness value to the range (0 to 1)
  const setScaleddarkness = Math.min(Math.max(darkness, 0), 1);
  // we are Computing  the bar width percentage (multiply by 100)
  const darknessPercent = setScaleddarkness * 100;
  
  return (
    <div className="darkness-comp" style={{ textAlign: 'center' }}>
      <h3 className="darkness-title" style={{ marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
        Room Darkness
      </h3>
      {/* To position the boxes correctly */}
      <div style={{ marginTop: '100px', fontWeight: 'bold' }}>
      </div>
      <div className="darkness-widget">
        <div className="darkness-contain">
          <div 
            className="darkness-display" 
            style={{ width: `${darknessPercent}%` }}
          />
        </div>
        <div className="darkness-value">{setScaleddarkness.toFixed(2)}</div>
      </div>
       {/* To position the boxes correctly */}
      <div style={{ marginTop: '100px', fontWeight: 'bold' }}>
      </div>
    </div>
  );
}

export default DarknessWidget;
