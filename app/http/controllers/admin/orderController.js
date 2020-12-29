const Order = require("../../../models/order");

function orderController() {
  return {
    async index(req, res, next) {
      res.header("Cache-Control", "no-store");
      if (!req.headers.ordersdata) return res.render("admin/orders");

      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          return res.json(orders || {});
        });
    },
  };
}

module.exports = orderController;
