import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { decreaseQuantity, increaseQuantity } from "../../redux/cart";
import { priceFilter, totalCart } from "../../util";

import "./CartOverlay.scss";

class CartOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "all",
      productList: [],
      currency: {},
    };
  }

  getProductList() {
    const graphqlQuery = {
      query: `{
        category(input:{title: ""}){
          products{
            id
            brand
            name
            gallery
            prices{
              currency
              amount
            }
            attributes{
              id
              name
              type
              items{
                displayValue
                value
                id
              }
            }
          }
        }
      }
      `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        const products = resData.data.category.products;
        const productCartList = this.props.cart.cart.productList;
        const filteredProduct = productCartList.map((productCart) => {
          let result;
          products.forEach((product) => {
            if (product.id === productCart.id) {
              return (result = {
                ...product,
                cartAttributes: productCart.attributes,
                quantity: productCart.quantity,
                transaction_id: productCart.transaction_id,
              });
            }
          });
          return result;
        });
        this.setState({ ...this.state, productList: filteredProduct });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getProductList();
  }

  componentDidUpdate(prevProps, prevState) {
    prevProps.cart.cart.productList.forEach((product) => {
      this.props.cart.cart.productList.forEach((prod) => {
        if (product.quantity !== prod.quantity && product.transaction_id === prod.transaction_id) {
          return this.getProductList();
        }
      });
    });
    if (prevProps.cart.cart.productList.length !== this.props.cart.cart.productList.length) {
      this.getProductList();
    }
  }

  render() {
    let totalPrice = totalCart(this.state.productList, this.props.currency);
    const currencySymbol = this.props.currency.currency.html;

    return (
      <div className="cart-overlay">
        <div className="cart-overlay__content">
          <p className="cart-overlay__title">
            <span className="text-bold">My Bag.</span>
            <span className="text-medium">
              {this.state.productList.length} {this.state.productList.length < 2 ? "Item" : "Items"}
            </span>
          </p>

          {this.state.productList.map((product, index) => {
            return (
              <div key={index} className="cart-overlay__itemlist">
                <div className="item__header">
                  <p className="text-light">
                    <span className="brand">{product.brand}</span>
                    <span className="product">{product.name}</span>
                  </p>
                  <p className="text-medium">
                    {currencySymbol} {priceFilter(product, this.props.currency)}
                  </p>
                  <div className="item__attribute">
                    {product.attributes.map((attr, idx) => {
                      return (
                        <div key={idx} className="wrapper">
                          <p className="item__attribute-title">{attr.name.length >= 9 ? attr.name.slice(0, 9) : attr.name}</p>
                          {attr.items.map((item, indx) => {
                            return (
                              <button
                                key={indx}
                                className={`btn uppercase  ${
                                  attr.type === "swatch" && product.cartAttributes[attr.id] === item.id
                                    ? item.id
                                    : product.cartAttributes[attr.id] === item.id
                                    ? "btn--black"
                                    : "btn--none"
                                }`}
                              >
                                {attr.type === "swatch" ? "" : item.value}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="item__quantity">
                  <button onClick={() => this.props.increaseQuantity(product.transaction_id)} className="btn">
                    +
                  </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => this.props.decreaseQuantity(product.transaction_id)} className="btn">
                    -
                  </button>
                </div>
                <img src={product.gallery[0]} className="item__image" alt="product" />
              </div>
            );
          })}

          <p className="cart-overlay__totalprice">
            <span className="text-medium">Total</span>
            <span className="text-bold">
              {currencySymbol}
              {totalPrice}
            </span>
          </p>
          <div className="cart-overlay__button">
            <Link to="/cart">
              <button className="btn button--bag">view bag</button>
            </Link>
            <button className="btn button--checkout">check out</button>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps())(CartOverlay);
