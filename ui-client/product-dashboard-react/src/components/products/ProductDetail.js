import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getProduct } from '../../datasources/productService';
import { getCart, addItem, createCart } from '../../datasources/cartService';
import { useToast } from '../ui/ToastContext';
import Button from '../ui/Button';
import FALLBACK_IMAGE from '../ui/fallbackImage';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const ensureCart = async () => {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      const created = await createCart();
      cartId = created.id;
      localStorage.setItem('cart_id', cartId);
    }
    return cartId;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await getProduct(id);
        setProduct(p);
      } catch (e) {
        const msg = e.message || 'Failed to load product';
        setError(msg);
        toast.push({ type: 'error', message: msg });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    setError('');
    try {
      const cartId = await ensureCart();
      // prevent adding more than stock
      if (quantity > (product.quantity || 0)) {
        const msg = 'Requested quantity exceeds available stock';
        setError(msg);
        toast.push({ type: 'error', message: msg });
        return;
      }
      await addItem(cartId, product.id, quantity);
      toast.push({ type: 'success', message: 'Added to cart successfully' });
      history.push('/cart');
    } catch (e) {
      const msg = e.message || 'Failed to add to cart';
      setError(msg);
      toast.push({ type: 'error', message: msg });
    }
  };

  if (isLoading) return <div className="container mt-4">Loading...</div>;

  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {product.image_url ? <img src={product.image_url} alt={product.title} className="img-fluid" /> : <img src={FALLBACK_IMAGE} alt="No image" className="img-fluid" style={{ maxWidth: '100%' }} />}
        </div>
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <div className="text-muted mb-2">Category: {product.category_name}</div>
          <div className="mb-3">{product.description}</div>
          <div className="mb-3">Price: <strong>{product.price}</strong></div>
          <div className="mb-3">Available: <strong>{product.quantity}</strong></div>

          <div className="mb-3 d-flex gap-2 align-items-center">
            <input type="number" className="form-control" style={{width:100}} value={quantity}
                   onChange={(e)=> setQuantity(Number(e.target.value))} />
            <Button className={'btn-primary'} onClick={handleAddToCart}>Add to cart</Button>
          </div>

          <Button className={'btn-outline-secondary'} onClick={() => history.push('/products')}>Back to products</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
