import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
// BrowserRouter -> Forma de fazer roteamente, + utilizado quando fazemos rotas atraves do browser

const Routes = () => {
    return(
        <BrowserRouter >
            <Route component={Home} path="/"exact />
            <Route component={CreatePoint} path="/create-point"/>
        </ BrowserRouter>
    )
}

export default Routes;