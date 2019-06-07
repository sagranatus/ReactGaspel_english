import React from 'react';
import { Provider } from 'react-redux';
import MainPage from './pages/MainPage'
import store from './pages/store';


export default () => (
  <Provider store={store}>
    <MainPage />
  </Provider>
);
