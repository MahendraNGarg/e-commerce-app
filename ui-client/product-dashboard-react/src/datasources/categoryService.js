import { get, post, put, del } from './apiService';

const endpoint = '/api/categories';

  /**
   * Get all categories
   */
export const getCategories = async () => {return await get(`${endpoint}/`);}

  /**
   * Get a single category
   */
export const getCategory = async (id) => {
    return get(`${endpoint}/${id}/`);
  }

  /**
   * Create a new category
   */
export const createCategory = async (category) => {
    return post(`${endpoint}/`, category);
  }

  /**
   * Update a category
   */
export const updateCategory = async (id, category)=> {
    return put(`${endpoint}/${id}/`, category);
}

  /**
   * Delete a category
   */
export const deleteCategory = (id) => {
    return del(`${endpoint}/${id}/`);
}