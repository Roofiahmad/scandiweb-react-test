import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { addToCart } from "../../redux/cart";
import { priceFilter } from "../../util";
import Header from "../../components/Header/Header";

import "./ProductDetail.scss";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "all",
      preview: "",
      product: {
        gallery: [],
        attributes: [],
      },
      userProduct: {
        id: "",
        productPrice: { price: 0, currency: "" },
        attributes: {},
      },
      redirect: false,
    };
    this.switchCategory = this.switchCategory.bind(this);
    this.setPreview = this.setPreview.bind(this);
  }

  switchCategory(category) {
    this.setState({ ...this.state, category: category });
  }

  setPreview(e) {
    const url = e.target.src;
    this.setState({ ...this.state, preview: url });
  }

  getProductById() {
    const productId = window.location.pathname.split("/detail/")[1];
    const graphqlQuery = {
      query: `{
        product(id:"${productId}"){
          id
          brand
          name
          gallery
          inStock
          description
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
          prices{
            currency
            amount
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
        const product = resData.data.product;
        product.gallery = product.gallery.slice(0, 4);
        const calculatedPrice = priceFilter(product, this.props.currency);
        const currency = this.props.currency.currency.key;
        this.setState({
          ...this.state,
          product,
          preview: product.gallery[0],
          userProduct: { ...this.state.userProduct, productPrice: { price: calculatedPrice, currency }, id: product.id },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleButtonAttribute(type, value) {
    const newAttribute = { ...this.state.userProduct.attributes };
    newAttribute[`${type}`] = value;
    this.setState({ ...this.state, userProduct: { ...this.state.userProduct, id: this.state.product.id, attributes: newAttribute } });
  }

  handleButtonCart() {
    this.props.addToCart(this.state.userProduct);
    this.setState({ ...this.state, redirect: true });
  }

  componentDidMount() {
    this.getProductById();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currency.currency.key !== this.props.currency.currency.key) {
      this.setState({ ...this.state, productPrice: priceFilter(this.state.product, this.props.currency) });
    }
  }

  render() {
    return (
      <div>
        <Header switchCategory={this.switchCategory} category={this.state.category} />
        <div className="product-detail">
          <div className="product-detail__gallery">
            {this.state.product.gallery.map((image, idx) => {
              return (
                <img
                  style={{ opacity: image === this.state.preview ? 1 : 0.6, border: image === this.state.preview ? "1px solid #5ece7b" : "none" }}
                  key={idx}
                  onClick={(e) => this.setPreview(e)}
                  className="product"
                  alt={`product-${idx}`}
                  src={image}
                />
              );
            })}
          </div>
          <div className="product-detail__image-preview-container">
            <img className="image-preview" alt="product-1" src={this.state.preview} />
          </div>
          <div className="product-detail__action">
            <h1 className="product-title">
              <span className="product-title__brand">{this.state.product.brand}</span>
              <span className="product-title__entity">{this.state.product.name}</span>
            </h1>
            {this.state.product.attributes.length
              ? this.state.product.attributes.map((attr, idx) => {
                  return (
                    <div key={idx} className="product-attribute">
                      <p className="label uppercase">{attr.name}:</p>
                      <div className="btn-container">
                        {attr.items.map((item, indx) => {
                          return (
                            <button
                              onClick={() => this.handleButtonAttribute(attr.id, item.id)}
                              key={indx}
                              className={`btn-attribute uppercase ${
                                item.id === this.state.userProduct.attributes[attr.name] ? "active" : attr.type === "swatch" ? item.id : "default"
                              }`}
                            >
                              {attr.type === "swatch" ? item.displayValue : item.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              : ""}

            <div className="product-price">
              <p className="label uppercase">price:</p>
              <p className="price">
                {this.props.currency.currency.html}
                {this.state.userProduct.productPrice.price}
              </p>
            </div>
            <button onClick={() => this.handleButtonCart()} disabled={!this.state.product.inStock} className="btn-cart uppercase">
              add to cart
            </button>
            <div className="product-description" dangerouslySetInnerHTML={{ __html: this.state.product.description }}></div>
          </div>
        </div>
        {this.state.redirect ? <Navigate to="/cart" /> : ""}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
});

const mapDispatchToProps = () => ({
  addToCart,
});

export default connect(mapStateToProps, mapDispatchToProps())(ProductDetail);
