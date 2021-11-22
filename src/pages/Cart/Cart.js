import React, { Component } from "react";
import Header from "../../components/Header/Header";
import { connect } from "react-redux";

import "./Cart.scss";
import CartList from "../../components/CartList/CartList";
import { Link } from "react-router-dom";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "all",
      productList: [],
      currency: {},
    };

    this.switchCategory = this.switchCategory.bind(this);
  }

  switchCategory(category) {
    this.setState({ ...this.state, category: category });
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
        if (product.quantity !== prod.quantity && product.id === prod.id) {
          this.getProductList();
        }
      });
    });
    if (prevProps.cart.cart.productList.length !== this.props.cart.cart.productList) {
      this.getProductList();
    }
  }

  render() {
    return (
      <>
        <Header switchCategory={this.switchCategory} category={this.state.category} />
        <div className="cart">
          <p className="cart__title uppercase ">Cart</p>
          {this.state.productList.length ? (
            this.state.productList.map((product, idx) => {
              return <CartList key={idx} ixp={idx} product={product} />;
            })
          ) : (
            <div className="sorry">
              <p>your cart is empty</p>
              <p>let's start exploring the product :)</p>
              <Link to="/">
                <button className="btn-cart uppercase">go to store</button>
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
  cart: state.cart,
});

export default connect(mapStateToProps)(Cart);
