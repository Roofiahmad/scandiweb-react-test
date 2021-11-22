const numberWithCommas = (x) => {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const priceFilter = (productProps, currencyProps, prodQty = 1) => {
  let price = "";
  if (productProps) {
    const key = currencyProps.currency.key;
    price = productProps.prices.filter((price) => {
      return price.currency === key;
    })[0];
  }
  return numberWithCommas(price.amount * prodQty);
};

const totalCart = (productList = [], currencyProps) => {
  let totalPrice = 0;
  productList.forEach((product) => {
    let price = "";
    if (product) {
      const key = currencyProps.currency.key;
      price = product.prices.filter((price) => {
        return price.currency === key;
      })[0];
    }
    totalPrice += price.amount * product.quantity;
  });
  return numberWithCommas(totalPrice);
};

export { priceFilter, totalCart };
