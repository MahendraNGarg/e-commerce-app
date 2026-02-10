import React, { useMemo, useState, useEffect } from "react";

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
  { value: 4, label: "Critical" },
];

const toNumberOrEmpty = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
};

const mapPriority = (p) => {
  if (p === null || p === undefined || p === "") return 2;
  // numeric already
  const n = Number(p);
  if (Number.isFinite(n)) return n;
  // map legacy labels (strings) to numbers
  const s = String(p).toLowerCase();
  if (s.includes('low')) return 1;
  if (s.includes('medium')) return 2;
  if (s.includes('high')) return 3;
  if (s.includes('critical')) return 4;
  return 2;
};

const normalizeInitial = (initialProduct) => ({
  title: initialProduct?.title || "",
  description: initialProduct?.description || "",
  category: initialProduct?.category || "",
  price: initialProduct?.price ?? "",
  quantity: initialProduct?.quantity ?? "",
  priority: toNumberOrEmpty(mapPriority(initialProduct?.priority ?? 2)),
  is_featured: Boolean(initialProduct?.is_featured),
  image_url: initialProduct?.image_url || "",
});

const ProductForm = ({
  categories,
  initialProduct,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}) => {
  const initial = useMemo(() => normalizeInitial(initialProduct), [initialProduct]);
  const [form, setForm] = useState(initial);
  // Update internal form state when the parent provides a new initialProduct
  useEffect(() => {
    setForm(initial);
    // reset touched when initial changes so validation UX is correct
    setTouched({});
  }, [initial]);
  const [touched, setTouched] = useState({});

  const setField = (name, value) => {
    // coerce numeric-like fields to numbers so validation is consistent
    if (name === 'price') {
      const n = value === '' ? '' : Number(value);
      setForm((p) => ({ ...p, [name]: n }));
      return;
    }
    if (name === 'quantity') {
      const n = value === '' ? '' : Number(value);
      setForm((p) => ({ ...p, [name]: n }));
      return;
    }
    if (name === 'priority' || name === 'category') {
      const n = value === '' ? '' : Number(value);
      setForm((p) => ({ ...p, [name]: n }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };
  const markTouched = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const validation = useMemo(() => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.category) errors.category = "Category is required.";
    if (form.price === "" || !Number.isFinite(Number(form.price))) {
      errors.price = "Price must be a number.";
    } else if (Number(form.price) < 0) {
      errors.price = "Price must be >= 0.";
    }
    // quantity must be an integer >= 0
    if (form.quantity === "" || !Number.isFinite(Number(form.quantity))) {
      errors.quantity = "Quantity must be a number.";
    } else if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) {
      errors.quantity = "Quantity must be an integer >= 0.";
    }
    if (![1, 2, 3, 4].includes(Number(form.priority))) {
      errors.priority = "Priority is required.";
    }
    return errors;
  }, [form]);

  const canSubmit = Object.keys(validation).length === 0 && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      category: true,
      price: true,
  quantity: true,
      priority: true,
    });
    if (!canSubmit) return;

    const payload = {
      title: form.title.trim(),
      description: form.description,
      category: Number(form.category),
      price: Number(form.price),
  quantity: Number(form.quantity),
      priority: Number(form.priority),
      is_featured: Boolean(form.is_featured),
      image_url: form.image_url || "",
    };

    await onSubmit(payload);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error ? <div className="alert alert-danger">{error}</div> : null}

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className={`form-control ${touched.title && validation.title ? "is-invalid" : ""}`}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                onBlur={() => markTouched("title")}
                placeholder="e.g. Wireless Headphones"
              />
              {touched.title && validation.title ? (
                <div className="invalid-feedback">{validation.title}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className={`form-select ${
                  touched.category && validation.category ? "is-invalid" : ""
                }`}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                onBlur={() => markTouched("category")}
              >
                <option value="">Select a category</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {touched.category && validation.category ? (
                <div className="invalid-feedback">{validation.category}</div>
              ) : null}
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${touched.price && validation.price ? "is-invalid" : ""}`}
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  onBlur={() => markTouched("price")}
                />
                {touched.price && validation.price ? (
                  <div className="invalid-feedback">{validation.price}</div>
                ) : null}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Priority</label>
                <select
                  className={`form-select ${
                    touched.priority && validation.priority ? "is-invalid" : ""
                  }`}
                  value={form.priority}
                  onChange={(e) => setField("priority", e.target.value)}
                  onBlur={() => markTouched("priority")}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {touched.priority && validation.priority ? (
                  <div className="invalid-feedback">{validation.priority}</div>
                ) : null}
              </div>

              <div className="col-md-4 mb-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    id="is_featured"
                    className="form-check-input"
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setField("is_featured", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="is_featured">
                    Featured
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                className="form-control"
                value={form.image_url}
                onChange={(e) => setField("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Saving..." : submitLabel}
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

