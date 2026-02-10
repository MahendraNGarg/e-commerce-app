import React from 'react';
import ReactDOM from 'react-dom';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders with default label', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Spinner />, div);
    expect(div.querySelector('[role="status"]')).not.toBeNull();
    expect(div.textContent).toContain('Loading...');
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders with custom label', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Spinner label="Loading data..." />, div);
    expect(div.textContent).toContain('Loading data...');
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders spinner with correct size class', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Spinner size="md" />, div);
    expect(div.querySelector('.spinner-border-md')).not.toBeNull();
    ReactDOM.unmountComponentAtNode(div);
  });
});
