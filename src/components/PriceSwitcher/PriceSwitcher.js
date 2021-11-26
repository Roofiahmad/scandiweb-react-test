import React, { Component } from "react";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";

import { setCurrency } from "../../redux/currency";

import "./PriceSwitcher.scss";

class PriceSwitcher extends Component {
  constructor() {
    super();

    this.state = {
      currency: [],
    };
    this.changeCurrency = this.changeCurrency.bind(this);
  }

  changeCurrency(key) {
    this.props.priceSwitchToggle();
    this.props.setCurrency(key);
  }

  getCurrency() {
    const graphqlQuery = {
      query: `{
        currencies
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
        const result = resData.data.currencies.map((curr) => {
          return { key: curr, html: getSymbolFromCurrency(curr) };
        });
        this.setState({ currency: result });
      });
  }

  componentDidMount() {
    this.getCurrency();
  }

  render() {
    return (
      <div className="price-switcher">
        <ul>
          {this.state.currency.map((curr, index) => {
            return (
              <li key={index} className="price-switcher__list" onClick={() => this.changeCurrency(curr.key)}>
                {curr.html} <span>{curr.key}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = () => ({
  setCurrency,
});

export default connect(null, mapDispatchToProps())(PriceSwitcher);
