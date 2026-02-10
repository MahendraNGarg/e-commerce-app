import React from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider, useToast } from './ToastContext';

describe('ToastContext', () => {
  it('renders ToastProvider without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ToastProvider>
        <div>Test child</div>
      </ToastProvider>,
      div
    );
    expect(div.textContent).toContain('Test child');
    ReactDOM.unmountComponentAtNode(div);
  });

  it('useToast hook provides push and remove functions', () => {
    let toastContext = null;
    const TestComponent = () => {
      toastContext = useToast();
      return <div>Test</div>;
    };
    const div = document.createElement('div');
    ReactDOM.render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
      div
    );
    expect(toastContext).not.toBeNull();
    expect(typeof toastContext.push).toBe('function');
    expect(typeof toastContext.remove).toBe('function');
    ReactDOM.unmountComponentAtNode(div);
  });
});
