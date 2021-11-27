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

    this.container = React.createRef();
    this.state = {
      priceSwitch: false,
      cartMenu: false,
    };
    this.priceSwitchToggle = this.priceSwitchToggle.bind(this);
    this.cartMenuToggle = this.cartMenuToggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  priceSwitchToggle = function () {
    this.setState({ ...this.state, priceSwitch: !this.state.priceSwitch, cartMenu: false });
  };

  cartMenuToggle = function () {
    this.setState({ ...this.state, cartMenu: !this.state.cartMenu, priceSwitch: false });
  };

  handleClickOutside = (event) => {
    // console.log();
    if ((this.container.current && !this.container.current.contains(event.target)) || event.target.className === "cart-overlay") {
      this.setState({
        priceSwitch: false,
        cartMenu: false,
      });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    return (
      <>
        <header>
          <CategorySwitcher />
          <Link to="/">
            <ShopIcon className="shop-icon" />
          </Link>
          <div className="switch-container" ref={this.container}>
            <div className="currency" onClick={this.priceSwitchToggle}>
              <p>{this.props.currency.currency.html}</p> <i className="fas fa-chevron-down"></i>
            </div>
            <div className="cart" onClick={this.cartMenuToggle}>
              <CartIcon />
              {this.props.cart.productList.length > 0 ? (
                <div className="cart-badge">
                  <span className="cart-badge-count">{this.props.cart.productList.length}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            {this.state.priceSwitch ? <PriceSwitcher priceSwitchToggle={this.priceSwitchToggle} /> : ""}
            {this.state.cartMenu ? <CartOverlay /> : ""}
          </div>
        </header>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Header);
