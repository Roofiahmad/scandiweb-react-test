import React, { Component } from "react";
import { connect } from "react-redux";

import { decreaseQuantity, increaseQuantity } from "../../redux/cart";
import { priceFilter } from "../../util";
import "./CartList.scss";

class CartList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      totalPrice: {},
      imagePreviewIndex: 0,
    };
  }

  prevImage() {
    let newIndexPreview;
    this.state.imagePreviewIndex !== 0
      ? (newIndexPreview = this.state.imagePreviewIndex - 1)
      : (newIndexPreview = this.state.product.gallery.length - 1);
    this.setState({ ...this.state, imagePreviewIndex: newIndexPreview });
  }

  nextImage() {
    let newIndexPreview;
    this.state.imagePreviewIndex !== this.state.product.gallery.length - 1
      ? (newIndexPreview = this.state.imagePreviewIndex + 1)
      : (newIndexPreview = 0);
    this.setState({ ...this.state, imagePreviewIndex: newIndexPreview });
  }

  componentDidMount() {
    this.setState({ ...this.state, product: this.props.product });
  }

  render() {
    const currencyProps = this.props.currency;
    const currencySymbol = currencyProps.currency.html;

    return (
      <div key={this.props.product.id} className="cart__itemlist">
        <div className="item__header">
          <p className="title">
            <span className="title--bold">{this.props.product.brand}</span> <span className="title--light">{this.props.product.name}</span>
          </p>
          <p className="title--price">
            {currencySymbol} {priceFilter(this.props.product, currencyProps, this.props.product.quantity)}
          </p>
          <div className="item__attribute">
            {this.props.product.attributes.map((attr) => {
              return attr.items.map((item, indx) => {
                return (
                  <button
                    key={indx}
                    // className={`btn uppercase tooltip ${
                    //   this.props.product.cartAttributes[attr.id] === item.id ? "btn--black" : attr.type === "swatch" ? item.id : "btn--none"
                    // }`}
                    className={`btn uppercase tooltip ${
                      attr.type === "swatch" && this.props.product.cartAttributes[attr.id] === item.id
                        ? item.id
                        : this.props.product.cartAttributes[attr.id] === item.id
                        ? "btn--black"
                        : "btn--none"
                    }`}
                  >
                    {attr.type === "swatch" ? item.displayValue : item.value}
                    <span className="tooltiptext">{attr.id}</span>
                  </button>
                );
              });
            })}
          </div>
        </div>
        <div className="item__quantity">
          <button onClick={() => this.props.increaseQuantity(this.props.product.transaction_id)} className="btn-quantity">
            +
          </button>
          <span className="quantity">{this.props.product.quantity}</span>
          <button onClick={() => this.props.decreaseQuantity(this.props.product.transaction_id)} className="btn-quantity">
            -
          </button>
        </div>
        <div
          className="item__image"
          style={{
            backgroundImage: `url(${this.props.product.gallery[this.state.imagePreviewIndex]})`,
          }}
        >
          <button onClick={() => this.prevImage()} className="btn image-navigation">
            <span>&#8249;</span>
          </button>
          <button onClick={() => this.nextImage()} className="btn image-navigation">
            <span>&#8250;</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
  cart: state.cart,
});

const mapDispatchToProps = () => ({
  decreaseQuantity,
  increaseQuantity,
});

export default connect(mapStateToProps, mapDispatchToProps())(CartList);
