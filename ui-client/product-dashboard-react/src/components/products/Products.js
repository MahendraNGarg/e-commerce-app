import React from 'react'
import {useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";
import {getProducts, deleteProduct, toggleFeatured} from "../../datasources/productService";
import { createCart, addItem } from '../../datasources/cartService';
import {getCategories} from "../../datasources/categoryService";
import Button from '../ui/Button';
import LinkButton from '../ui/LinkButton';
import FALLBACK_IMAGE from '../ui/fallbackImage';
import { useToast } from '../ui/ToastContext';
import ConfirmDialog from '../ui/ConfirmDialog';


const initProductFilters = {
    category: undefined,
    page: 1,
    page_size: 10,
}

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productFilters, setProductFilters] = useState(initProductFilters);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    // default fallback image
    const DEFAULT_IMAGE = FALLBACK_IMAGE;

    const actionBtnStyle = {
        width: 88,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0.35rem 0.5rem',
        whiteSpace: 'normal',
    };

    const toast = useToast();

    const loadProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getProducts(productFilters); // Call the API with filters
            const results = response?.results || [];
            setProducts(results);
            const count = response?.count ?? results.length;
            setTotalCount(count);
            const pageSize = productFilters.page_size || initProductFilters.page_size;
            const page = productFilters.page || 1;
            setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
            setLoading(false)
        } catch (error) {
            setLoading(false);
            setError(error.message || "Failed to load products.");
            toast.push({ type: 'error', message: error.message || 'Failed to load products' });
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response?.results || []);
        } catch (error) {
            setError(error.message || "Failed to load categories.");
            toast.push({ type: 'error', message: 'Failed to load categories' });
        }
    }

    const handleDeleteProduct = async (productId) => {
        setDeleteConfirm(productId);
    }

    const confirmDelete = async () => {
        const productId = deleteConfirm;
        setDeleteConfirm(null);
        try {
            await deleteProduct(productId).then(() => {
                loadProducts();
                toast.push({ type: 'success', message: 'Product deleted successfully' });
            });
        } catch (error) {
            console.log("Error deleting product:", error);
            toast.push({ type: 'error', message: error.message || 'Failed to delete product' });
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm(null);
    }

    const history = useHistory();

    const handleAddToCart = async (product) => {
        try{
            let cartId = localStorage.getItem('cart_id');
            if (!cartId) {
                const created = await createCart();
                cartId = created.id;
                localStorage.setItem('cart_id', cartId);
            }
            // prevent adding beyond available stock
            if ((product.quantity || 0) < 1) {
                toast.push({ type: 'error', message: 'Product out of stock' });
                return;
            }
            await addItem(cartId, product.id, 1);
            // navigate to cart so it reflects the addition (mirrors ProductDetail behaviour)
            history.push('/cart');
        } catch (error) {
            console.log("Error adding to cart:", error);
            toast.push({ type: 'error', message: error.message || 'Failed to add to cart' });
        }
    }

    const handleToggleFeatured = async (product) => {
        try{
            await toggleFeatured(product.id, !product.is_featured).then(
                (updatedProduct) => {
                    const index = products.findIndex(p => p.id === product.id);
                    if (index !== -1){
                        const updatedProducts = [...products];
                        updatedProducts[index] = updatedProduct;
                        setProducts(updatedProducts);
                        toast.push({ type: 'success', message: `Product ${updatedProduct.is_featured ? 'featured' : 'unfeatured'} successfully` });
                    }
                })
        }
        catch (error){
            console.log("Error toggling featured:", error);
            toast.push({ type: 'error', message: error.message || 'Failed to update featured status' });
        }
    }

    useEffect(() => {
        const fetchInitialData =  () => {
            loadCategories().catch((error) => {console.error("Error fetching categories:", error);})
            loadProducts().catch((error) => {console.error("Error fetching products:", error);})
        }
        fetchInitialData()
    }, []);

    useEffect(() => {
        const fetchProducts = () => {
            loadProducts().catch((error) => {
                console.error("Error fetching products:", error);
            });
        };

        fetchProducts();
    }, [productFilters]);

    const SelectCategory = () => {
        const handleCategoryChange = (event) => {
            setProductFilters({
                ...productFilters,
                category: event.target.value || undefined, // Update category filter
                page: 1,
            });
        };
        return (
            <div className="me-2">
                <select className="form-select" value={productFilters.category || ''} onChange={handleCategoryChange}>
                    <option value=''>All Categories</option>
                    {categories && categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setProductFilters({
            ...productFilters,
            search: search || undefined,
            page: 1,
        });
    }

    const getPriorityLabel = (p) => {
        const n = Number(p);
        switch (n) {
            case 1:
                return 'Low';
            case 2:
                return 'Medium';
            case 3:
                return 'High';
            case 4:
                return 'Critical';
            default:
                return p;
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="m-0">Products</h2>
                <div className="d-flex gap-2">
                    <Link className="btn btn-outline-primary" to="/featured">View featured</Link>
                    <Link className="btn btn-primary" to="/products/new">New product</Link>
                </div>
            </div>

            {error ? <div className="alert alert-danger">{error}</div> : null}

            <div className="d-flex flex-wrap gap-2 mb-3">
                <SelectCategory/>
                <form className="d-flex" onSubmit={handleSearchSubmit}>
                    <input
                        className="form-control me-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title/description..."
                    />
                    <button className="btn btn-outline-secondary" type="submit">Search</button>
                </form>
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                        setSearch("");
                        setProductFilters(initProductFilters);
                    }}
                >
                    Clear
                </button>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-info">No products found.</div>
            ) : (
                <>
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                                <tr>
                                    <th style={{width:120}}>Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th className="text-end">Price</th>
                                    <th className="text-end">Available</th>
                                    <th>Priority</th>
                                    <th>Featured</th>
                                    <th style={{width: 220}}>Actions</th>
                                </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                                            className="img-thumbnail"
                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }}
                                        />
                                    ) : (
                                        <img src={DEFAULT_IMAGE} alt="No image" className="img-thumbnail" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                                    )}
                                </td>
                                <td>
                                    <div className="fw-bold">{product.title}</div>
                                
                                </td>
                                <td>{product.category_name}</td>
                                <td className="text-end">{product.price}</td>
                                <td className="text-end">{product.quantity ?? 0}</td>
                                <td>{getPriorityLabel(product.priority)}</td>
                                <td>
                                    <span className={`badge ${product.is_featured ? "bg-success" : "bg-secondary"}`}>
                                        {product.is_featured ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <LinkButton to={`/products/${product.id}/edit`} className={'btn-outline-secondary btn-sm'} style={{ width: 88, height: 40 }}>
                                            Edit
                                        </LinkButton>
                                        <LinkButton to={`/products/${product.id}`} className={'btn-outline-secondary btn-sm'} style={{ width: 88, height: 40 }}>
                                            View
                                        </LinkButton>
                                        <Button
                                            className={product.is_featured ? 'btn-warning btn-sm' : 'btn-outline-warning btn-sm'}
                                            onClick={() => handleToggleFeatured(product)}
                                            style={{ width: 88, height: 40 }}
                                        >
                                            {product.is_featured ? 'Unfeature' : 'Feature'}
                                        </Button>
                                        <Button
                                            className={'btn-outline-danger btn-sm'}
                                            onClick={() => handleDeleteProduct(product.id)}
                                            style={{ width: 88, height: 40 }}
                                        >
                                            Delete
                                        </Button>
                                        {(() => {
                                            const available = (product.quantity ?? 0) > 0;
                                            return (
                                                <Button
                                                    className={available ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
                                                    onClick={() => handleAddToCart(product)}
                                                    style={{ width: 88, height: 40 }}
                                                    disabled={!available}
                                                    title={!available ? 'Out of stock' : 'Add to cart'}
                                                >
                                                    Add to cart
                                                </Button>
                                            );
                                        })()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">Showing {products.length} of {totalCount} products</div>
                    <div className="btn-group" role="group" aria-label="Pagination">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setProductFilters({...productFilters, page: Math.max(1, (productFilters.page || 1) - 1)})}
                            disabled={(productFilters.page || 1) <= 1}
                        >
                            Prev
                        </button>
                        <button className="btn btn-light disabled">Page {productFilters.page || 1} of {totalPages}</button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setProductFilters({...productFilters, page: Math.min(totalPages, (productFilters.page || 1) + 1)})}
                            disabled={(productFilters.page || 1) >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
                </>
            )}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Confirm Delete"
                    message="Are you sure you want to delete this product? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}

export default Products