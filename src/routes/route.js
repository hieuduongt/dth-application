import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminProductDetailPage from '../components/Admin-UI/Product/product';
import UserProductDetailPage from '../components/User-UI/Product/product';
import UserProductListPage from '../components/User-UI/ListProducts/list-products';

import UserHomePage from '../components/User-UI/Home/home';

import UserCategoryListPage from '../components/Admin-UI/Category/category';
import Cart from '../components/User-UI/Cart/cart';
import LoginPage from '../components/Login/login';
import RegisterPage from '../components/Register/register';
import PATHS from '../commons/paths';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';
import ProtectedRoute from './protectedRoute';

const MainRoute = () => {
    // let element = useRoutes(routes);
    return (
        <Routes>
            <Route index path='/' element={<UserHomePage />} />
            <Route path={PATHS.LOGIN} exact element={<LoginPage />} />
            <Route path={PATHS.REGISTER} element={<RegisterPage />} />
            <Route path={PATHS.ADMIN.PATH} element={<ProtectedRoute roles={["Admin", "Seller", "Manager", "User"]}><AdminLayout /></ProtectedRoute>} />
        </Routes>
    );
}

export default MainRoute;