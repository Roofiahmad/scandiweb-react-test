import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import { toggleAttributeCart } from "../../redux/cart";
import cartIcon from "../../images/cart-white.svg";
import { priceFilter } from "../../util";
import "./ProductCard.scss";

class ProductCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      product: {},
      productPrice: 0,
      attributePopUp: false,
      redirect: false,
    };
  }

  productCartHandler(e) {
    if (e.target.className === "product__cart-button" || e.target.className === "product__cart-icon") {
      this.props.toggleAttributeCart({ toggle: true, product: this.props.product });
    } else {
      this.setState({ ...this.state, redirect: true });
    }
  }

  componentDidMount() {
    if (this.props) {
      this.setState({ ...this.state, product: this.props.product, productPrice: priceFilter(this.props.product, this.props.currency) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currency.currency.key !== this.props.currency.currency.key) {
      this.setState({ ...this.state, productPrice: priceFilter(this.props.product, this.props.currency) });
    }
  }

  render() {
    return (
      <div
        className="product-card"
        onMouseEnter={() => this.setState({ ...this.state, hover: true })}
        onMouseLeave={() => this.setState({ ...this.state, hover: false })}
      >
        <div onClick={(e) => this.productCartHandler(e)} className="product-card__image-container">
          <img src={this.props.product.gallery[0]} alt="Product" className={`${!this.props.product.inStock ? "out-of-stock" : 1} product__image`} />
          {!this.props.product.inStock ? <p className="product__out-of-stock">Out Of Stock</p> : ""}
          {!this.state.hover || !this.props.product.inStock || (
            <button className="product__cart-button">
              <img className="product__cart-icon" src={cartIcon} alt="cart-icon" />
            </button>
          )}
        </div>

        <div className="product-card__product-attribute-container">
          {this.props.product.attributes.map((attr, idx) => {
            return (
              <>
                <p>{attr.name}</p>
                <div key={idx} className="attribute">
                  {attr.items.map((item, index) => {
                    return (
                      <button key={index} className={attr.type === "swatch" ? `${item.id}` : "default"}>
                        {attr.type === "swatch" ? "" : item.value}
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
        <h2 className={` ${!this.props.product.inStock ? "out-of-stock" : 1} product-card__title`}>{this.props.product.brand}</h2>
        <h2 className={`${!this.props.product.inStock ? "out-of-stock" : 1} product-card__title`}>{this.props.product.name}</h2>
        <p className={`${!this.props.product.inStock ? "out-of-stock" : 1} product-card__price`}>
          {this.props.currency.currency.html}
          {this.state.productPrice}
        </p>
        {this.state.redirect ? <Navigate to={`/detail/${this.props.product.id}`} /> : ""}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
});

const mapDispatchToProps = () => ({
  toggleAttributeCart,
});

export default connect(mapStateToProps, mapDispatchToProps())(ProductCard);
