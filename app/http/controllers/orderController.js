const Order = require("../../models/order");
const moment = require("moment");

function orderController() {
  return {
    async postOrder(req, res) {
      const { phone, address } = req.body;

      if (!(phone && address)) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });
      try {
        await order.save();
        req.flash("success", "Orders placed successfully");
        req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
        return res.redirect("/orders");
      } catch (ex) {
        req.flash("error", "Something went wrong");
        return res.redirect("/cart");
      }
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header("Cache-Control", "no-store");
      res.render("customers/orders", {
        orders: orders,
        moment: moment,
      });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);

      if (order.customerId.toString() === req.user._id.toString()) {
        return res.render("customers/singleOrder", { order });
      }
      return res.redirect("/");
    },
  };
}

module.exports = orderController;
