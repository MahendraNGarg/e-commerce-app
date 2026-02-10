import React from "react";
import {Route, Redirect} from 'react-router-dom';
import Products from "./components/products/Products";
import ProductCreate from "./components/products/ProductCreate";
import ProductEdit from "./components/products/ProductEdit";
import ProductDetail from "./components/products/ProductDetail";
import FeaturedProducts from "./components/products/FeaturedProducts";
import Assignment from "./components/assignment/Assignment";
import CartView from "./components/cart/CartView";

const routesMap =[
    {
        id:1,
        path: '/',
        redirectTo: '/assignment',
    },
    {
        id: 2,
        path: '/products',
        component: Products
    },
    {
        id: 3,
        path: '/products/new',
        component: ProductCreate
    },
    {
        id: 4,
        path: '/products/:id/edit',
        component: ProductEdit
    },
    {
        id: 2.5,
        path: '/products/:id',
        component: ProductDetail
    },
    {
        id: 5,
        path: '/featured',
        component: FeaturedProducts
    },
    {
        id: 6,
        path: '/assignment',
        component: Assignment
    },
    {
        id: 6.5,
        path: '/cart',
        component: CartView
    },
    {
        id:7,
        path: '*',
        redirectTo: '/products'
    }
]

export const routes = routesMap.map((route, index) => {
    if (route.redirectTo) {
        return (
            <Redirect
                key={route.id}
                exact
                from={route.path}
                to={route.redirectTo}
            />
        );
    }

    // Compute exact: routes without dynamic segments should be exact
    const hasDynamic = route.path && route.path.includes(':');
    const exact = !hasDynamic;

    return (
        <Route
            key={index}
            exact={exact}
            path={route.path}
            component={route.component}
        />
    );
});
