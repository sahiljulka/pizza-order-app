import Noty from "noty";
import initAdmin from "./admin.js";

const $ = document.querySelectorAll.bind(document);

const addToCartButtons = $(".add-to-cart");
const counterLabel = $(".counter")[0];

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
