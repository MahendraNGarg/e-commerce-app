import React from 'react';

// Enterprise-grade button: fixed size, centered text, clear disabled/loading states
const Button = ({ children, onClick, className = 'btn-primary', disabled = false, loading = false, type = 'button', style = {} }) => {
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
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
  style={{ ...baseStyle, ...style }}
    >
      {loading ? (
        <span className="d-flex align-items-center">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          <span>Loading</span>
        </span>
      ) : (
        <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>{children}</span>
      )}
    </button>
  );
};

export default Button;
