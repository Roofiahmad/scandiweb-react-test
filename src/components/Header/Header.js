import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import CategorySwitcher from "../CategorySwicher/CategorySwitcher";
import CartOverlay from "../CartOverlay/CartOverlay";
import PriceSwitcher from "../PriceSwitcher/PriceSwitcher";

import { ReactComponent as ShopIcon } from "../../images/shopIcon.svg";
import { ReactComponent as CartIcon } from "../../images/cart.svg";

import "./Header.scss";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      priceSwitch: false,
      cartMenu: false,
    };
    this.priceSwitchToggle = this.priceSwitchToggle.bind(this);
    this.cartMenuToggle = this.cartMenuToggle.bind(this);
    this.closeAllToggle = this.closeAllToggle.bind(this);
  }

  priceSwitchToggle = function () {
    this.setState({ ...this.state, priceSwitch: !this.state.priceSwitch, cartMenu: false });
  };

  cartMenuToggle = function () {
    this.setState({ ...this.state, cartMenu: !this.state.cartMenu, priceSwitch: false });
  };

  closeAllToggle = function () {
    this.setState({ ...this.state, cartMenu: false, priceSwitch: false });
  };

  render() {
    return (
      <>
        <header>
          <CategorySwitcher closeAllToggle={this.closeAllToggle} />
          <Link onClick={() => this.closeAllToggle()} to="/">
            <ShopIcon />
          </Link>
          <div className="switch-container">
            <div className="currency" onClick={this.priceSwitchToggle}>
              <p>{this.props.currency.currency.html}</p> <i className="fas fa-chevron-down"></i>
            </div>
            <div className="cart">
              <CartIcon onClick={this.cartMenuToggle} />
            </div>
          </div>
        </header>
        {this.state.cartMenu ? <CartOverlay /> : ""}
        {this.state.priceSwitch ? <PriceSwitcher priceSwitchToggle={this.priceSwitchToggle} /> : ""}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
});

export default connect(mapStateToProps)(Header);
