const Order = require("../../../models/order");

function statusController() {
  return {
    async changeStatus(req, res, next) {
      Order.updateOne(
        { _id: req.body.orderId },
        { status: req.body.status },
        (err, data) => {
          if (err) {
            return res.redirect("/adminorders");
          }

          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderUpdated", {
            id: req.body.orderId,
            status: req.body.status,
          });
          return res.redirect("/adminorders");
        }
      );
    },
  };
}

module.exports = statusController;
