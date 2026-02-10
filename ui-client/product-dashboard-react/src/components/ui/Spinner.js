import React from 'react';

const Spinner = ({ size = 'sm', label = 'Loading...' }) => {
  const className = `spinner-border spinner-border-${size}`;
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="d-inline-block">
      <div className={className} style={{ verticalAlign: 'middle' }} />
      <span className="visually-hidden">{label}</span>
    </div>
  );
};

export default Spinner;
