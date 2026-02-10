import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../datasources/productService";
import { getCategories } from "../../datasources/categoryService";
import ProductForm from "./ProductForm";

const ProductEdit = () => {
  const history = useHistory();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [categoriesResponse, productResponse] = await Promise.all([
          getCategories(),
          getProduct(id),
        ]);
        setCategories(categoriesResponse?.results || []);
        setProduct(productResponse);
      } catch (e) {
        setError(e.message || "Failed to load product.");
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (payload) => {
    setError("");
    setSubmitting(true);
    try {
      await updateProduct(id, payload);
      history.push("/products");
    } catch (e) {
      setError(e.message || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product && error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-secondary" onClick={() => history.push("/products")}>
          Back
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <ProductForm
      categories={categories}
      initialProduct={product}
      submitLabel="Save changes"
      onSubmit={handleSubmit}
      onCancel={() => history.push("/products")}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
};

export default ProductEdit;

