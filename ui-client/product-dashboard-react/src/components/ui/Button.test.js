import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

describe('Button', () => {
  it('renders with children and default styling', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Click me</Button>, div);
    expect(div.textContent).toContain('Click me');
    const btn = div.querySelector('button');
    expect(btn).not.toBeNull();
    // check sizing style applied
    expect(btn.style.height).toBe('40px');
    ReactDOM.unmountComponentAtNode(div);
  });

  it('shows loading state when loading=true', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button loading>Save</Button>, div);
    expect(div.textContent).toContain('Loading');
    const spinner = div.querySelector('.spinner-border');
    expect(spinner).not.toBeNull();
    ReactDOM.unmountComponentAtNode(div);
  });
});
