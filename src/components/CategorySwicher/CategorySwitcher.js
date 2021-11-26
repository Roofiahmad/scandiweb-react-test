import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setCategory } from "../../redux/category";

import "./CategorySwitcher.scss";

class CategorySwitcher extends Component {
  constructor(props) {
    super(props);
    this.categories = ["all", "clothes", "tech"];
  }
  render() {
    return (
      <div className="category-switcher">
        <ul>
          {this.categories.map((category, idx) => {
            return (
              <li key={idx} onClick={() => this.props.setCategory(category)} className={this.props.category.value === category ? "text-green" : ""}>
                <Link to="/">{category}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  category: state.category,
});

const mapDispatchToProps = () => ({
  setCategory,
});

export default connect(mapStateToProps, mapDispatchToProps())(CategorySwitcher);
