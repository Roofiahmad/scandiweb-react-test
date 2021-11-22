import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

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
    };
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
        <Link to={`/detail/${this.props.product.id}`}>
          <div className="product-card__image-container">
            <img
              src={this.props.product.gallery[0]}
              alt="Product"
              className="product__image"
              style={{ opacity: !this.props.product.inStock ? 0.3 : 1 }}
            />
            {!this.props.product.inStock ? <p className="product__out-of-stock">Out Of Stock</p> : ""}
            {!this.state.hover || !this.props.product.inStock || (
              <button className="product__cart-button">
                <img src={cartIcon} width={"90%"} alt="cart-icon" />
              </button>
            )}
          </div>
        </Link>
        <h2 style={{ opacity: !this.state.inStock ? 0.5 : 1 }} className="product-card__title">
          {this.props.product.name}
        </h2>
        <p style={{ opacity: !this.state.inStock ? 0.5 : 1 }} className="product-card__price">
          {this.props.currency.currency.html}
          {this.state.productPrice}
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
});

export default connect(mapStateToProps)(ProductCard);
