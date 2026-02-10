import React from 'react';
import ReactDOM from 'react-dom';
import ProductForm from './ProductForm';

describe('ProductForm validation', () => {
  it('shows validation messages for empty required fields', (done) => {
    const div = document.createElement('div');
    const mockSubmit = jest.fn();
    ReactDOM.render(
      <ProductForm categories={[]} initialProduct={null} submitLabel="Create" onSubmit={mockSubmit} onCancel={() => {}} isSubmitting={false} error={""} />,
      div
    );

    setTimeout(() => {
      // try to submit with empty required fields
      const form = div.getElementsByTagName('form')[0];
      form.dispatchEvent(new Event('submit', { bubbles: true }));
      setTimeout(() => {
        expect(div.textContent).toContain('Title is required.');
        expect(div.textContent).toContain('Category is required.');
        ReactDOM.unmountComponentAtNode(div);
        done();
      }, 0);
    }, 0);
  });
});
