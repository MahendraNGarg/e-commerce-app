import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createProduct } from "../../datasources/productService";
import { getCategories } from "../../datasources/categoryService";
import ProductForm from "./ProductForm";

const ProductCreate = () => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getCategories();
        setCategories(response?.results || []);
      } catch (e) {
        setError(e.message || "Failed to load categories.");
      }
    };
    load();
  }, []);

  const handleSubmit = async (payload) => {
    setError("");
    setSubmitting(true);
    try {
      await createProduct(payload);
      history.push("/products");
    } catch (e) {
      setError(e.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProductForm
      categories={categories}
      initialProduct={null}
      submitLabel="Create product"
      onSubmit={handleSubmit}
      onCancel={() => history.push("/products")}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
};

export default ProductCreate;

