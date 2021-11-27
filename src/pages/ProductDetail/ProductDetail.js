import React, { Component } from "react";
import { connect } from "react-redux";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

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
      successAdded: false,
      error: false,
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
    const prodAttrKey = this.state.product.attributes.length;
    const selectedAttr = Object.keys(this.state.userProduct.attributes).length;
    if (prodAttrKey !== selectedAttr) {
      // if some attribute empty
      return this.setState({ ...this.state, error: true }, () => {
        setTimeout(() => {
          this.setState({ ...this.state, error: false });
        }, 1000);
      });
    }
    // if all attribute selected
    this.props.addToCart(this.state.userProduct);
    this.setState(
      {
        ...this.state,
        successAdded: true,
        userProduct: {
          ...this.state.userProduct,
          attributes: {},
        },
      },
      () => {
        setTimeout(() => {
          this.setState({ ...this.state, successAdded: false });
        }, 1000);
      }
    );
  }

  componentDidMount() {
    this.getProductById();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currency.currency.key !== this.props.currency.currency.key) {
      this.setState({
        ...this.state,
        userProduct: {
          ...this.state.userProduct,
          productPrice: { price: priceFilter(this.state.product, this.props.currency), currency: this.props.currency.currency.key },
        },
      });
    }
  }

  render() {
    const cleanHtml = DOMPurify.sanitize(this.state.product.description, { USE_PROFILES: { html: true } });

    return (
      <div>
        <Header switchCategory={this.switchCategory} category={this.state.category} />
        <div className="product-detail">
          <div className="product-detail__gallery">
            {this.state.product.gallery.map((image, idx) => {
              return (
                <img
                  key={idx}
                  onClick={(e) => this.setPreview(e)}
                  className={`${image === this.state.preview ? "selected" : ""} product`}
                  alt={`product-${idx}`}
                  src={image}
                />
              );
            })}
          </div>
          <div className="product-detail__image-preview-container">
            <img className={this.state.product.inStock ? "image-preview" : "image-preview outOfStock"} alt="product-1" src={this.state.preview} />
            {this.state.product.inStock ? "" : <span className="label">Out of stock</span>}
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
                              className={`btn-attribute uppercase ${attr.type === "swatch" ? item.id : "default"}
                              ${item.id === this.state.userProduct.attributes[attr.name] ? "active" : ""}
                              `}
                            >
                              {attr.type === "swatch" ? "" : item.value}
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
                {/* {priceFilter(this.props.product, this.props.currency)} */}
              </p>
            </div>
            <button onClick={() => this.handleButtonCart()} disabled={!this.state.product.inStock} className="btn-cart uppercase">
              add to cart
            </button>
            <div className="product-description">{parse(cleanHtml)}</div>
          </div>
          {this.state.successAdded ? (
            <div className="message-success">
              <p>your product succesfully added to cart :)</p>
            </div>
          ) : (
            ""
          )}
          {this.state.error ? (
            <div className="message-error">
              <p>attribute can't be empty !!!</p>
            </div>
          ) : (
            ""
          )}
        </div>
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
