import React from 'react';
import ReactDOM from 'react-dom';
import CartView from './CartView';

jest.mock('../../datasources/cartService', () => ({
  createCart: jest.fn(async () => ({ id: 1 })),
  getCart: jest.fn(async () => ({ id: 1, items: [], total: '0.00' })),
  addItem: jest.fn(async () => ({})),
  updateItem: jest.fn(async () => ({})),
  removeItem: jest.fn(async () => ({})),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: jest.fn() }),
}));

describe('CartView', () => {
  it('renders without crashing', (done) => {
    const div = document.createElement('div');
    ReactDOM.render(<CartView />, div);
    setTimeout(() => {
      expect(div.textContent).toContain('Shopping Cart');
      ReactDOM.unmountComponentAtNode(div);
      done();
    }, 0);
  });
});
