import React, { Component } from "react";
import { connect } from "react-redux";

import { setCategory } from "../../redux/category";

import "./CategorySwitcher.scss";

class CategorySwitcher extends Component {
  constructor(props) {
    super(props);
    this.categories = ["all", "clothes", "tech"];
  }
  render() {
    return (
      <div onClick={() => this.props.closeAllToggle()} className="category-switcher">
        <ul>
          {this.categories.map((category, idx) => {
            return (
              <li key={idx} onClick={() => this.props.setCategory(category)} className={this.props.category.value === category ? "text-green" : ""}>
                {category}
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
