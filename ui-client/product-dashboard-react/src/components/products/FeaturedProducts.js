import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts, toggleFeatured } from "../../datasources/productService";

const normalizeList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getFeaturedProducts();
  // Some backends might return unfiltered lists; ensure we only show items flagged as featured
  const list = normalizeList(response).filter((p) => Boolean(p.is_featured));
  setProducts(list);
    } catch (e) {
      setError(e.message || "Failed to load featured products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUnfeature = async (product) => {
    // Defensive: don't call API if item is already not featured
    if (!product.is_featured) {
      setError('Product is not featured.');
      // ensure UI stays consistent by removing it from list
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      return;
    }
    try {
      await toggleFeatured(product.id, false);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (e) {
      // show server-provided message when available
      setError(e.message || "Failed to update featured status.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Featured Products</h2>
        <Link className="btn btn-outline-primary" to="/products">
          Back to Products
        </Link>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {isLoading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No featured products yet.</div>
      ) : (
        <div className="list-group">
          {products.map((p) => (
            <div key={p.id} className="list-group-item d-flex justify-content-between">
              <div>
                <div className="fw-bold">{p.title}</div>
                <div className="text-muted">Category: {p.category_name}</div>
              </div>
              <div className="d-flex gap-2">
                <Link className="btn btn-sm btn-outline-secondary" to={`/products/${p.id}/edit`}>
                  Edit
                </Link>
                <button className="btn btn-sm btn-warning" onClick={() => handleUnfeature(p)}>
                  Unfeature
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;

