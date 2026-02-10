import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getCart, addItem, updateItem, removeItem, createCart } from '../../datasources/cartService';
import { useToast } from '../ui/ToastContext';
import Button from '../ui/Button';

const CartView = () => {
  const history = useHistory();
  const toast = useToast();
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ensureCart = async () => {
    // try to read an existing cart id from localStorage
    let id = localStorage.getItem('cart_id');
    if (!id) {
      const created = await createCart();
      id = created.id;
      localStorage.setItem('cart_id', id);
    }
    setCartId(id);
    return id;
  };

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const id = await ensureCart();
      const data = await getCart(id);
      setCart(data);
    } catch (e) {
      const msg = e.message || 'Failed to load cart';
      setError(msg);
      toast.push({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setLoading(true);
    try {
      await updateItem(cartId, item.id, newQty);
      await load();
    } catch (e) {
      const msg = e.message || 'Failed to update item';
      setError(msg);
      toast.push({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    setLoading(true);
    try {
      await removeItem(cartId, item.id);
      await load();
    } catch (e) {
      const msg = e.message || 'Failed to remove item';
      setError(msg);
      toast.push({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="container mt-4">Loading cart...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Shopping Cart</h2>
        <Button className={'btn-outline-secondary'} onClick={() => history.push('/products')}>Continue shopping</Button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-bold">{item.product.title}</div>
                    <div className="text-muted small">{item.product.category_name}</div>
                  </td>
                  <td>{item.product.price}</td>
                  <td>
                    <input type="number" className="form-control" style={{width:100}} value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, Number(e.target.value))} />
                  </td>
                  <td className="text-end">{(Number(item.product.price) * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button className={'btn-outline-danger btn-sm'} onClick={() => handleRemove(item)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} />
                <td className="text-end fw-bold">{cart.total}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default CartView;
