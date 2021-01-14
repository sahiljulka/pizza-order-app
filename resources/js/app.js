import Noty from "noty";
import initAdmin from "./admin.js";
import moment from "moment";
import * as io from "socket.io/client-dist/socket.io";

const $ = document.querySelectorAll.bind(document);

const addToCartButtons = $(".add-to-cart");
const counterLabel = $(".counter")[0];
const order = $("#hiddenInput")[0]
  ? JSON.parse($("#hiddenInput")[0].value)
  : null;
const statuses = $(".status_line");

async function updateCart(pizza) {
  try {
    const response = await fetch("/update-cart", {
      method: "POST",
      body: pizza,
      headers: {
        "Content-type": "application/json",
      },
    });
    const res = await response.json();
    new Noty({
      type: "success",
      text: "Item added to Cart",
      timeout: 1000,
      progressBar: false,
    }).show();
    counterLabel.innerText = res.totalQty;
  } catch (e) {
    new Noty({
      type: "error",
      text: "Something went wrong",
      timeout: 1000,
      progressBar: false,
    }).show();
  }
}

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    updateCart(btn.dataset.pizza);
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

let time = document.createElement("small");

function updateStatus(order) {
  if (!order) return;

  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);

(function setSocket() {
  let socket = io();

  const pathName = window.location.pathname;
  if (pathName.includes("adminorders")) {
    initAdmin(socket);
    socket.emit("join", `adminRoom`);
  }

  if (!order) return;
  socket.emit("join", `order_${order._id}`);

  socket.on("orderUpdated", (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format("hh:mm A");
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
      type: "success",
      timeout: 1000,
      text: "Order updated",
      progressBar: false,
    }).show();
  });
})();
