import React from 'react';
import { Switch, Route } from 'react-router-dom'
import LoginPage from '../components/Login/login';
import RegisterPage from '../components/Register/register';
import PATH from '../commons/path';

function AuthRoute() {
    return (
        <Switch>
            <Route exact path={PATH.LOGIN} component={LoginPage} />
            <Route exact path={PATH.REGISTER} component={RegisterPage} />
        </Switch>
    );
}

export default AuthRoute;