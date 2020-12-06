function cartController() {
  return {
    index(req, res) {
      console.log(req.session);
      return res.render("./customers/cart");
    },
    update(req, res) {
      const pizza = req.body;
      let cart;
      // no cart associated with the session
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      cart = req.session.cart;

      //If item does not exist in the cart
      if (!cart.items[pizza._id]) {
        cart.items[pizza._id] = {
          item: pizza,
          qty: 1,
        };
        cart.totalQty += 1;
        cart.totalPrice += pizza.price;
      }
      //If item exists in the cart
      else {
        cart.items[pizza._id].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice += pizza.price;
      }
      return res.json({ totalQty: cart.totalQty });
    },
  };
}

module.exports = cartController;
