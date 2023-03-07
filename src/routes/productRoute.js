import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminProductListPage from '../components/Admin-UI/ListProducts/list-products';
import AdminProductDetailPage from '../components/Admin-UI/Product/product';
import UserProductDetailPage from '../components/User-UI/Product/product';
import UserProductListPage from '../components/User-UI/ListProducts/list-products';
import PATH from '../commons/path';

function HomeRoute() {
    return (
        <Switch>
            <Route exact path={PATH.ADMIN.LIST_PRODUCTS} component={AdminProductListPage} />
            <Route exact path={PATH.ADMIN.PRODUCT_DETAIL} component={AdminProductDetailPage} />
            <Route exact path={PATH.USER.LIST_PRODUCTS} component={UserProductListPage} />
            <Route exact path={PATH.USER.PRODUCT_DETAIL} component={UserProductDetailPage} />
        </Switch>
    );
}

export default HomeRoute;