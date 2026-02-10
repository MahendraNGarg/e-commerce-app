import React from 'react';

const Assignment = () => {
  return (
    <div className="container assignment-container mt-4">
      <div className="card header-card mb-4">
        <div className="card-header">
          <h5 className="card-title">🚀 Product Showcase - Development Assignment</h5>
        </div>
        <div className="card-body">
          <p className="subtitle">Task list for building this application</p>
        </div>
      </div>

      <div className="accordion" id="assignmentAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Product Management Features
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#assignmentAccordion"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Improve product listing layout
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Implement product detail view
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Add product creation form
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Add product creation form (Backend submitting the add form updates the models/table on the backend)
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Implement product edit functionality
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Implement product edit functionality (Backend edit submit form updates the model on the backend)
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Implement product deletion
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Implement product deletion (Backend delete submit form updates the models/table on the backend)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              Shopping Cart Features
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse show"
            aria-labelledby="headingTwo"
            data-bs-parent="#assignmentAccordion"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Add products to cart
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  View cart contents
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Update product quantities in cart
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Add a quantity field to products model and restrict the cart additions based on available stock (Backend & Frontend)
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  Remove products from cart
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" />
                  When a product price is updated, the cart should reflect the changes
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              UI/UX Nice to Haves
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#assignmentAccordion"
          >
            <div className="accordion-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Design responsive layout
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Add loading states and spinners
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Implement error handling and toast notifications
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Add pagination for product list
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Create featured products carousel
                </li>
                <li className="list-group-item">
                  <input type="checkbox" className="form-check-input me-2" disabled />
                  Add product image gallery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;