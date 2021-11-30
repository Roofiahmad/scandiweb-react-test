import React, { Component } from "react";
import { connect } from "react-redux";

import { toggleAttributeCart, addToCart } from "../../redux/cart";
import "./ProductAttributesPopup.scss";

class ProductAttributesPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProduct: {
        id: this.props.attributesPopUp.product.id,
        productPrice: { price: 0, currency: "" },
        attributes: {},
      },
      successAdded: false,
      error: false,
    };
  }

  handleButtonAttribute(type, value) {
    const newAttribute = { ...this.state.userProduct.attributes };
    newAttribute[`${type}`] = value;
    this.setState({ ...this.state, userProduct: { ...this.state.userProduct, id: this.props.attributesPopUp.product.id, attributes: newAttribute } });
  }

  handleButtonCart() {
    const prodAttrKey = this.props.attributesPopUp.product.attributes.length;
    const selectedAttr = Object.keys(this.state.userProduct.attributes).length;
    if (prodAttrKey !== selectedAttr) {
      return this.setState({ ...this.state, error: true }, () => {
        setTimeout(() => {
          this.setState({ ...this.state, error: false });
        }, 1000);
      });
    }
    this.props.addToCart(this.state.userProduct);
    console.log(this.state.userProduct);
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
          this.setState({
            ...this.state,
            successAdded: false,
          });
        }, 1000);
      }
    );
  }

  componentDidMount() {}
  render() {
    return (
      <div className="productAttributesPopup">
        <div className="productAttributesPopup-container">
          <span onClick={() => this.props.toggleAttributeCart({ toggle: false, product: {} })} className="close">
            x
          </span>
          <p className="brand">{this.props.attributesPopUp.product.brand}</p>
          <p className="title">{this.props.attributesPopUp.product.name}</p>
          <img className="image" src={this.props.attributesPopUp.product.gallery[0]} alt="product" />
          <div className="attribute-container">
            {this.props.attributesPopUp.product.attributes.map((attr, idx) => {
              return (
                <>
                  <p key={attr.name} className="attribute-name">
                    {attr.name}
                  </p>
                  <div key={idx} className="attribute">
                    {attr.items.map((item, index) => {
                      return (
                        <button
                          onClick={() => this.handleButtonAttribute(attr.id, item.id)}
                          key={index}
                          className={`uppercase ${attr.type === "swatch" ? item.id : "default"}
                          ${item.id === this.state.userProduct.attributes[attr.name] ? "active" : ""}
                          `}
                        >
                          {attr.type === "swatch" ? "" : item.value}
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
          <button onClick={() => this.handleButtonCart()} className="btn-cart uppercase">
            add to cart
          </button>
          {this.state.successAdded ? (
            <div className="message-success">
              <p>product succesfully added</p>
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
  attributesPopUp: state.cart.attributePopup,
});

const mapDispatchToProps = () => ({
  toggleAttributeCart,
  addToCart,
});

export default connect(mapStateToProps, mapDispatchToProps())(ProductAttributesPopup);
