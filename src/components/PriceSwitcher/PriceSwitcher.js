import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrency } from "../../redux/currency";

import "./PriceSwitcher.scss";

class PriceSwitcher extends Component {
  constructor() {
    super();

    this.currency = [
      { key: "USD", text: "USD", html: <span>&#65284;</span> },
      { key: "GBP", text: "GBP", html: <span>&#163;</span> },
      { key: "AUD", text: "AUD", html: <span>&#65284;</span> },
      { key: "JPY", text: "YPN", html: <span>&#165;</span> },
      { key: "RUB", text: "RUB", html: <span>&#8381;</span> },
    ];

    this.changeCurrency = this.changeCurrency.bind(this);
  }

  changeCurrency(key) {
    this.props.priceSwitchToggle();
    this.props.setCurrency(key);
  }

  render() {
    return (
      <div className="price-switcher">
        <ul>
          {this.currency.map((curr, index) => {
            return (
              <li key={index} className="price-switcher__list" onClick={() => this.changeCurrency(curr.key)}>
                {curr.html} <span>{curr.text}</span>
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
