import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomeRoute from './homeRoute';
import CategoryRoute from './categoryRoute';
import ProductRoute from './productRoute';
import CartRoute from './cartRoute';

const Route = () => {
    return (
        <BrowserRouter>
            <HomeRoute />
            <CategoryRoute />
            <ProductRoute />
            <CartRoute />
        </BrowserRouter>
    );
}

export default Route;