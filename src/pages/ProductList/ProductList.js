import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrency } from "../../redux/currency";
import { setCategory } from "../../redux/category";

import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./ProductList.scss";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  getProductList() {
    const category = this.props.category.value === "all" ? "" : this.props.category.value;
    const graphqlQuery = {
      query: `{
        category(input:{title: "${category}"}){
          name
          products{
            id
            name
            inStock
            gallery
            prices{
              currency
              amount
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
        this.setState({ ...this.state, products: products });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getProductList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.category.value !== this.props.category.value) {
      this.getProductList();
    }
  }

  render() {
    return (
      <div className="products-list">
        <Header />
        <main>
          <h1 className="product-list__title">{this.props.category.value ? this.props.category.value : "all"} category</h1>
          <div className="product-container">
            {this.state.products.length
              ? this.state.products.map((prod) => {
                  return <ProductCard key={prod.id} product={prod} />;
                })
              : ""}
          </div>
        </main>
        <footer style={{ marginBottom: "2.5%" }}></footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currency: state.currency,
  category: state.category,
});

const mapDispatchToProps = () => ({
  setCurrency,
  setCategory,
});

export default connect(mapStateToProps, mapDispatchToProps())(ProductList);
