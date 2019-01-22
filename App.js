import React from 'react';
import { Provider } from 'react-redux';
import Nav from './pages/Nav';
import store from './pages/store';


export default () => (
  <Provider store={store}>
    <Nav />
  </Provider>
);
