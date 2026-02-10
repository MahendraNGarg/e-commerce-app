# Product Management Feature Audit

This file records the feature audit for product management (frontend + backend), current status, key file references, and recommended next steps.

Checklist (markings: [ ] Not Started, [~] Partially Implemented, [x] Completed)

- Product listing layout
  - Status: [~] Partially Implemented
  - Notes: Backend provides `image_url` on Product. React `Products.js` displays `image_url` as a text line under the title; there is no dedicated Image column with a responsive thumbnail.
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/Products.js`
    - `api-server/catalog/models.py` (field: `image_url`)

- Product detail view
  - Status: [x] Completed
  - Notes: React `ProductDetail.js` displays the image responsively and shows product details and Add-to-cart flow.
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/ProductDetail.js`

- Product creation form (frontend)
  - Status: [x] Completed
  - Notes: `ProductForm.js` + `ProductCreate.js` implement creation UI with validation and consistent form layout (Bootstrap). Buttons present (Submit / Cancel).
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/ProductForm.js`
    - `ui-client/product-dashboard-react/src/components/products/ProductCreate.js`

- Product creation API (backend → updates product model/table)
  - Status: [x] Completed
  - Notes: `ProductViewSet` (ModelViewSet) exposes `POST /api/products/` to create products. Serializers include all product fields. Migrations present for model schema.
  - Key files:
    - `api-server/catalog/views.py` (ProductViewSet)
    - `api-server/catalog/serializers.py` (ProductSerializer)
    - `api-server/catalog/migrations/` (existing migrations)

- Product edit UI
  - Status: [x] Completed
  - Notes: `ProductEdit.js` + `ProductForm.js` implement the edit screen and use the same form as create.
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/ProductEdit.js`

- Product edit API (backend → updates product model/table)
  - Status: [x] Completed
  - Notes: `PUT/PATCH /api/products/{id}/` supported by `ProductViewSet`.
  - Key files:
    - `api-server/catalog/views.py`
    - `api-server/catalog/serializers.py`

- Product deletion UI
  - Status: [x] Completed
  - Notes: Delete button present in `Products.js` and calls react datasource which calls backend delete API.
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/Products.js`

- Product deletion API (backend → updates product model/table)
  - Status: [x] Completed
  - Notes: `DELETE /api/products/{id}/` supported by `ProductViewSet`.
  - Key files:
    - `api-server/catalog/views.py`


Testing & Quality

- Backend unit tests (product CRUD APIs)
  - Status: [x] Completed (basic coverage)
  - Notes: `api-server/catalog/tests.py` contains tests covering list pagination, create/update/delete, filters, featured endpoint, and cart price recalculation.
  - Key files:
    - `api-server/catalog/tests.py`

- Frontend unit tests
  - Product list rendering -> Status: [~] Partially Implemented (Products.test.js exists and checks rendering)
  - Product detail rendering -> Status: [x] Completed (ProductDetail.test.js exists)
  - Create/Edit/Delete flow tests -> Status: [ ] Not Started (no end-to-end or unit tests covering full create/edit/delete flows via the form + datasource)
  - Validation and error states -> Status: [~] Partially Implemented (form does local validation; tests for validation messages are absent)
  - Key files:
    - `ui-client/product-dashboard-react/src/components/products/Products.test.js`
    - `ui-client/product-dashboard-react/src/components/products/ProductDetail.test.js`


Summary of Gaps / Recommended Actions (low risk, small changes first)

1. Listing - image thumbnail column (FRONTEND)
   - Why: requirement mandates a dedicated Image column with responsive thumbnails.
   - What: update `Products.js` to add an Image column (left-most). Render a responsive <img> with `img-fluid` (Bootstrap) and constrain size (e.g., CSS class or inline style). Ensure alignment with table rows.
   - Tests: add a unit test to assert the image <img> appears when `image_url` is present and has correct responsive classes.

2. Buttons - consistent sizing & centered text (FRONTEND)
   - Why: global UI design system must be followed; all buttons must share same height/width and centered text.
   - What: audit button classes across product components and standardize using a shared utility class (e.g., `btn-fixed-size`) or consistent Bootstrap utilities. Do not change global styles outside design system; add a small component-level CSS file if needed.
   - Tests: visual/utility tests are manual; unit tests can assert button class presence.

3. Frontend tests for Create/Edit/Delete and validation (FRONTEND)
   - Why: missing automated coverage for critical flows.
   - What: add tests for `ProductForm` (validation, error display), and integration-style unit tests that mock `productService` to test submit/cancel flows in `ProductCreate` and `ProductEdit`. Add a test that simulates delete confirmation and calls `deleteProduct` in `Products.js`.

4. Backend: input validation and error responses (BACKEND)
   - Why: serializers provide basic field validation but custom server-side validation (e.g., price >= 0, quantity bounds) should be enforced.
   - What: add serializer `validate_price` / `validate_quantity` methods or `validate()` in `ProductSerializer`. Update tests to check invalid inputs return 400 with clear messages.

5. Migrations: none required for current audit
   - Notes: Product model already includes `image_url` and `quantity`. Existing migrations are present. If we add new fields or constraints, create new migrations via `makemigrations`.


Immediate next steps I can take (pick one to execute):

- Implement the dedicated Image column in React `Products.js` and add a small unit test for it.
- Add front-end unit tests for create/edit/delete flows and `ProductForm` validation.
- Add serializer validators for `price` and `quantity` and corresponding backend tests.

TODO management

- When I complete any code changes, I'll update this file and mark the corresponding item as [x] only when both FE and BE are done for that feature.

If you'd like, I can start by implementing the Image column in the React listing and add a unit test for it. Reply with which of the immediate next steps you want me to perform first, and I'll implement it following the project's patterns.
