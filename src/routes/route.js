import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomeRoute from './homeRoute';
import CategoryRoute from './categoryRoute';
import ProductRoute from './productRoute';
import CartRoute from './cartRoute';
import AuthRoute from './authRoute';

const Route = () => {
    return (
        <BrowserRouter>
            <AuthRoute />
            <HomeRoute />
            <CategoryRoute />
            <ProductRoute />
            <CartRoute />
        </BrowserRouter>
    );
}

export default Route;