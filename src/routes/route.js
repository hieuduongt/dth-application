import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomeRoute from './homeRoute';
import CategoryRoute from './categoryRoute';
import ProductRoute from './productRoute';

const Route = () => {
    return (
        <BrowserRouter>
            <HomeRoute/>
            <CategoryRoute/>
            <ProductRoute/>
        </BrowserRouter>
    );
}

export default Route;