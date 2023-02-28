import React from 'react';
import { Switch, Route } from 'react-router-dom'
import AdminHomePage from '../components/Admin-UI/Home/home';
import UserHomePage from '../components/User-UI/Home/home';
import PATH from '../commons/path';

function HomeRoute() {
    return (
        <Switch>
            <Route exact path={PATH.ADMIN.HOME} component={AdminHomePage} />
            <Route exact path={PATH.USER.HOME} component={UserHomePage} />
        </Switch>
    );
}

export default HomeRoute;