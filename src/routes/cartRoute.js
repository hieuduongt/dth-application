import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Cart from '../components/User-UI/Cart/cart';
import PATH from '../commons/path';

function CartRoute() {
    return (
        <Switch>
            <Route exact path={PATH.CART} component={Cart} />
        </Switch>
    );
}

export default CartRoute;