import { get, post, put, patch, del } from './apiService';

const endpoint = '/api/products';

  /**
   * Get all products with optional filters
   */
export const getProducts = async (filters = {}) => {
  return await get(`${endpoint}/`, filters);
};

  /**
   * Get a single product by ID
   */
export const getProduct = async (id) => {
  return await get(`${endpoint}/${id}/`);
};

  /**
   * Get featured products
   */
export const getFeaturedProducts = async () => {
  return await get(`${endpoint}/featured/`);
};

  /**
   * Create a new product
   */
export const createProduct = async (product) => {
  return await post(`${endpoint}/`, product);
};

  /**
   * Update an existing product
   */
export const updateProduct = async (id, product) => {
  return await put(`${endpoint}/${id}/`, product);
};

  /**
   * Partially update a product
   */
export const patchProduct = async (id, data) => {
  return await patch(`${endpoint}/${id}/`, data);
};

  /**
   * Delete a product
   */
export const deleteProduct = async (id) => {
  return await del(`${endpoint}/${id}/`);
};

  /**
   * Search products
   */
export const searchProducts = async (query) => {
  const response = await getProducts({ search: query, page_size: 20 });
  return response.results;
};

  /**
   * Get products by category
   */
export const getProductsByCategory = async (categoryId) => {
  const response = await getProducts({ category: categoryId });
  return response.results;
};

  /**
   * Toggle featured status
   */
export const toggleFeatured = async (id, isFeatured) => {
  return await patchProduct(id, { is_featured: isFeatured });
}
