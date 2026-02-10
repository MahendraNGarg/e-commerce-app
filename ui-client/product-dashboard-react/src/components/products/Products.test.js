import React from "react";
import ReactDOM from "react-dom";
import Products from "./Products";

jest.mock("../../datasources/productService", () => ({
  getProducts: jest.fn(async () => ({
  results: [{ id: 1, title: "Test Product", category_name: "Cat", price: 10, priority: 2, is_featured: false, image_url: 'https://example.com/img.jpg' }],
  })),
  deleteProduct: jest.fn(async () => ({})),
  toggleFeatured: jest.fn(async () => ({})),
}));

jest.mock("../../datasources/categoryService", () => ({
  getCategories: jest.fn(async () => ({
    results: [{ id: 1, name: "Cat" }],
  })),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children }) => <a href="/">{children}</a>,
}));

describe("Products", () => {
  it("renders without crashing", (done) => {
    const div = document.createElement("div");
    ReactDOM.render(<Products />, div);

    // allow effects to run
    setTimeout(() => {
  expect(div.textContent).toContain("Products");
  // ensure image element rendered
  const imgs = div.getElementsByTagName('img');
  expect(imgs.length).toBeGreaterThan(0);
      ReactDOM.unmountComponentAtNode(div);
      done();
    }, 0);
  });
});

