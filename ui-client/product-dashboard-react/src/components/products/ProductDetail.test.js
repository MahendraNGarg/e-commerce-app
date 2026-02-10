import React from 'react';
import ReactDOM from 'react-dom';
import ProductDetail from './ProductDetail';

jest.mock('../../datasources/productService', () => ({
  getProduct: jest.fn(async () => ({ id: 1, title: 'Test', description: 'd', category_name: 'Cat', price: '10.00', quantity: 5 })),
}));

jest.mock('../../datasources/cartService', () => ({
  createCart: jest.fn(async () => ({ id: 1 })),
  addItem: jest.fn(async () => ({})),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 1 }),
  useHistory: () => ({ push: jest.fn() }),
}));

describe('ProductDetail', () => {
  it('renders without crashing', (done) => {
    const div = document.createElement('div');
    ReactDOM.render(<ProductDetail />, div);
    setTimeout(() => {
      expect(div.textContent).toContain('Test');
      ReactDOM.unmountComponentAtNode(div);
      done();
    }, 0);
  });
});
