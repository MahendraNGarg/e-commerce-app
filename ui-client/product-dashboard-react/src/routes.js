import React from "react";
import {Route, Redirect} from 'react-router-dom';
import Products from "./components/products/Products";
import Assignment from "./components/assignment/Assignment";

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
        path: '/assignment',
        component: Assignment
    },
    {
        id:4,
        path: '*',
        redirectTo: '/products'
    }
]

export const routes = routesMap.map((route, index) => {
    if (route.redirectTo){
        return <Redirect key={route.id} exact from={route.path} to={route.redirectTo}/>
    }
    return (<Route
        key={index}
        exact={route.pathMatch === 'full'}
        path={route.path}
        component={route.component}
    />)
})
