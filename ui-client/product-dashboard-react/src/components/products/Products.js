import React from 'react'
import {useState, useEffect} from 'react';
import {getProducts, deleteProduct, toggleFeatured} from "../../datasources/productService";
import {getCategories} from "../../datasources/categoryService";


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

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts(productFilters); // Call the API with filters
            setProducts(response.results);
            setLoading(false)
        } catch (error) {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.results);
        } catch (error) {
        }
    }

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId).then(() => loadProducts())

            } catch (error) {
                console.log("Error deleting product:", error);
            }
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
                    }
                })
        }
        catch (error){
            console.log("Error toggling featured:", error);
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
            });
        };
        return (
            <div>
                <select value={productFilters.category || ''} onChange={handleCategoryChange}>
                    <option value=''>All Categories</option>
                    {categories && categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Products</h2>
            <SelectCategory/>
            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h4>{product.title}</h4>
                        <p>Category: {product.category_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products