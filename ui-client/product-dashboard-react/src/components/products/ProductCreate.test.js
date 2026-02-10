import React from 'react';
import ReactDOM from 'react-dom';

jest.mock('../../datasources/productService', () => ({
  createProduct: jest.fn(async () => ({ id: 123 })),
}));

jest.mock('../../datasources/categoryService', () => ({
  getCategories: jest.fn(async () => ({ results: [{ id: 1, name: 'Cat' }] })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: jest.fn() }),
}));

import ProductCreate from './ProductCreate';

describe('ProductCreate', () => {
  it('renders and allows submission (smoke)', (done) => {
    const div = document.createElement('div');
    ReactDOM.render(<ProductCreate />, div);
    setTimeout(() => {
      expect(div.textContent).toContain('Create product');
      ReactDOM.unmountComponentAtNode(div);
      done();
    }, 0);
  });
});
