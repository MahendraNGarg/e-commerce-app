import { get, post, patch, del } from './apiService';

const endpoint = '/api/carts';

export const createCart = async () => {
  return await post(`${endpoint}/`, {});
};

export const getCart = async (id) => {
  return await get(`${endpoint}/${id}/`);
};

export const addItem = async (cartId, productId, quantity = 1) => {
  return await post(`${endpoint}/${cartId}/add_item/`, { product_id: productId, quantity });
};

export const updateItem = async (cartId, itemId, quantity) => {
  return await patch(`${endpoint}/${cartId}/update_item/`, { item_id: itemId, quantity });
};

export const removeItem = async (cartId, itemId) => {
  // backend expects item_id in request.data for DELETE action
  return await del(`${endpoint}/${cartId}/remove_item/`, { item_id: itemId });
};

export const listCarts = async () => {
  return await get(`${endpoint}/`);
};
