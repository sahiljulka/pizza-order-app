import Noty from "noty";
import initAdmin from "./admin.js";
import moment from "moment";

const $ = document.querySelectorAll.bind(document);

const addToCartButtons = $(".add-to-cart");
const counterLabel = $(".counter")[0];
const order = $("#hiddenInput")[0];
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

initAdmin();

let time = document.createElement("small");

function updateStatus(order) {
  if (!order) return;
  order = JSON.parse(order.value);

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
