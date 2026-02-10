import React from 'react';
import { Link } from 'react-router-dom';

const LinkButton = ({ to, children, className = 'btn-primary', style = {}, ...rest }) => {
  const baseStyle = {
    minWidth: 88,
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 0.75rem',
    whiteSpace: 'nowrap',
    borderRadius: 6,
  };

  return (
    <Link to={to} className={`btn ${className}`} style={{ ...baseStyle, ...style }} {...rest}>
      {children}
    </Link>
  );
};

export default LinkButton;
