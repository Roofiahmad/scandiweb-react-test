import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./redux/store";
import Cart from "./pages/Cart/Cart";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ProductList from "./pages/ProductList/ProductList";

import "./App.scss";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/detail/:productId" element={<ProductDetail />} />
              <Route path="/" element={<ProductList />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    );
  }
}
