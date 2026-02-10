import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const push = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2, 9);
    setMessages(m => [...m, { id, ...msg }]);
    // auto-dismiss
    setTimeout(() => {
      setMessages(m => m.filter(x => x.id !== id));
    }, msg.duration || 4000);
  }, []);

  const remove = useCallback((id) => setMessages(m => m.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'fixed', right: 16, top: 16, zIndex: 1050 }}>
        {messages.map(m => (
          <div key={m.id} className={`toast show align-items-center text-white ${m.type === 'error' ? 'bg-danger' : 'bg-success'}`} role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: 240, marginBottom: 8 }}>
            <div className="d-flex">
              <div className="toast-body">{m.title ? <strong>{m.title}: </strong> : null}{m.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => remove(m.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
