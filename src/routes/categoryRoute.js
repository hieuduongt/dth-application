import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminCategoryListPage from '../components/Admin-UI/ListCategories/list-categories';
import AdminCategoryDetailPage from '../components/Admin-UI/Category/category';
import UserCategoryDetailPage from '../components/User-UI/ListCategories/list-categories';
import UserCategoryListPage from '../components/Admin-UI/Category/category';
import PATH from '../commons/path';

function HomeRoute() {
    return (
        <Switch>
            <Route exact path={PATH.ADMIN.LIST_CATEGORIES} component={AdminCategoryListPage} />
            <Route exact path={PATH.ADMIN.CATEGORY} component={AdminCategoryDetailPage} />
            <Route exact path={PATH.USER.LIST_CATEGORIES} component={UserCategoryListPage} />
        </Switch>
    );
}

export default HomeRoute;