import React from 'react';
import '../../styles/loadingspinner.css';

const LoadingSpinner = () => {
  return (
    <div className="coffee-spinner-container">
      <div className="coffee-spinner">
        <div className="bean"></div>
      </div>
      <div className="spinner-text">
        <span className="cafe">Cafe</span><span className="taleros">taleros</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;