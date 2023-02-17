// data base for selected products
const db = [
  {
    id: 1,
    name: "Handbag B10",
    price: 1100,
    image: "./assets/img/selection/selection1.png",
    category: "handbags",
    quantity: 100,
    description:
      "Vintage elements are paired with archival details as an ode to the glamour that permeates Kingdom's latest collections.",
  },
  {
    id: 2,
    name: "Bracelet C15",
    price: 756,
    image: "./assets/img/selection/selection2.png",
    category: "handbags",
    quantity: 200,
    description:
      "It appears enlarged and alongside other key motifs, such as the heart and floral motif. An exquisit accesory.",
  },
  {
    id: 3,
    name: "Watch D14",
    price: 902,
    image: "./assets/img/selection/selection3.png",
    category: "watches",
    quantity: 50,
    description:
      "The watch is presented with a thin multi-layer case and five-link steel bracelet, while the design is completed by pink glass.",
  },
  {
    id: 4,
    name: "Fragance F12",
    price: 1803,
    image: "./assets/img/selection/selection4.png",
    category: "beauty",
    quantity: 10,
    description:
      "Individual, yet fusing together naturally, the men's and women's perfumes embody a declaration of self-expression..",
  },
  {
    id: 5,
    name: "Fragance F25",
    price: 2100,
    image: "./assets/img/selection/selection5.png",
    category: "beauty",
    quantity: 500,
    description:
      "Individual, yet fusing together naturally, the men's and women's perfumes embody a declaration of self-expression.",
  },
  {
    id: 6,
    name: "Luxury Belt F25",
    price: 500,
    image: "./assets/img/selection/selection6.png",
    category: "beauty",
    quantity: 59,
    description:
      "Individual, yet fusing together naturally, the men's and women's perfumes embody a declaration of self-expression.",
  },
  {
    id: 7,
    name: "Handbag B15",
    price: 2400,
    image: "./assets/img/selection/selection7.png",
    category: "handbags",
    quantity: 50,
    description:
      "Individual, yet fusing together naturally, the men's and women's perfumes embody a declaration of self-expression.",
  },
  {
    id: 8,
    name: "Handbag Set B40",
    price: 2400,
    image: "./assets/img/selection/selection8.png",
    category: "handbags",
    quantity: 57,
    description:
      "Individual, yet fusing together naturally, the men's and women's perfumes embody a declaration of self-expression.",
  },
];

const selectedProducts = window.localStorage.getItem("productsDB")
  ? JSON.parse(window.localStorage.getItem("productsDB"))
  : db;

// Render selected products on the DOM
const productContainer = document.getElementById("selection__container");
function printSelectedProducts() {
  let html = "";
  for (const product of selectedProducts) {
    html += `
    <article class="selection__item">
    <div class="selection__figure">
        <img class="selection__img" src="${product.image}" alt="${product.name}">
    </div>
    <div class="selection__info">
        <h2 class="selection__name">${product.name}</h2>
        <p class="selection__description">
            ${product.description}
        </p>
        <div class="selection__purchase flex-column-center">
        <h3 class="selection__price"> ${product.price} EUR</h3>
        <button type="button" class="selection__button" data-id="${product.id}">
            Add to cart
        </button>
        <p class="selection__stock">Available: ${product.quantity} units</p>
    </div>
    </div>
</article>`;
  }
  productContainer.innerHTML = html;
  window.localStorage.setItem("productsDB", JSON.stringify(selectedProducts));
}
printSelectedProducts();

// Print Cart
let cart = window.localStorage.getItem("cartDB")
  ? JSON.parse(window.localStorage.getItem("cartDB"))
  : [];
const cartContainer = document.getElementById("cart-wrapper");
const cartCounter = document.getElementById("cart-counter");
const itemCounter = document.getElementById("item-counter");
const cartTotal = document.getElementById("cart-total");
function printCart() {
  let html = "";
  for (const article of cart) {
    const product = selectedProducts.find((p) => p.id === article.id);
    html += `
        <div class="cart__detail">
            <div class="img-center">
                <img class="cart__img" src="${product.image}" alt="${
      product.name
    }">
            </div>
              <div class="cart__details">
                <div class="cart__product">
                  <span>${product.name}</span>
                  <span>${numberToCurrency(product.price)}</span>
                </div>
                <div class="cart__buttons">
                  <div class="cart__qty flex-center">
                    <button type="button" class="cart__button flex-center add-to-cart" data-id="${
                      product.id
                    }" type="button">+</button>
                    <span>${article.qty}</span>
                    <button button type="button" class="cart__button flex-center remove-from-cart" data-id="${
                      product.id
                    }" type="button">-</button>
                  </div>
                  <button type="button" class="cart__button cart-remove flex-center" data-id="${
                    product.id
                  }">
                    <i class='bx bxs-trash' ></i>
                  </button>
                </div>
                <div class="cart__amount">
                  <span>Subtotal</span>
                  <span>${numberToCurrency(product.price * article.qty)}</span>
                </div>
              </div>
            </div>
        `;
  }
  cartContainer.innerHTML = html;
  cartCounter.innerHTML = totalArticles();
  itemCounter.innerHTML = totalArticles();
  cartTotal.innerHTML = numberToCurrency(totalAmount());
  checkButtons();
  window.localStorage.setItem("cartDB", JSON.stringify(cart));
}

printCart();

// Add articles to the cart
function addToCart(id, qty = 1) {
  const product = selectedProducts.find((p) => p.id === id);
  if (product && product.quantity > 0) {
    const article = cart.find((a) => a.id === id); //this is to see if the id I want to add already exists in the cart
    if (article) {
      if (checkStock(id, qty + article.qty)) {
        //if stock is enough
        article.qty++;
      } else {
        window.alert("No hay stock suficiente"); //but if stock is not enough
      }
    } else {
      cart.push({ id, qty });
    }
  } else {
    //if there are no products available to add
    window.alert("Producto agotado");
  }
  printCart();
}

// Stock management: I should not be able to add more items than available, and stock has got to follow changes lives
function checkStock(id, qty) {
  const product = selectedProducts.find((p) => p.id === id);
  return product.quantity - qty >= 0;
}

//Remove articles from the cart 1 by 1, with buttons + and -, and wait for the client to confirm before removing all the items of a specific product
function removeFromCart(id, qty = 1) {
  const article = cart.find((a) => a.id === id);
  if (article && article.qty - qty > 0) {
    article.qty--;
  } else {
    const confirm = window.confirm("Are youy sure?");
    if (confirm) {
      cart = cart.filter((a) => a.id !== id);
    }
  }
  printCart();
}

// Delete from the cart
function deleteFromCart(id) {
  const article = cart.find((a) => a.id === id);
  cart.splice(cart.indexOf(article), 1);
  printCart();
}

// Counter for total number of items added to the cart
function totalArticles() {
  return cart.reduce((acc, article) => acc + article.qty, 0);
}

// Show the client the amount of the receipt
function totalAmount() {
  return cart.reduce((acc, article) => {
    const product = selectedProducts.find((p) => p.id === article.id);
    return acc + product.price * article.qty;
  }, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    printCart();
    // openModal2()
}

// Buy products:
// We want to reset the cart, render the product on the DOM with updated stocks
function checkout() {
  cart.forEach((article) => {
    const product = selectedProducts.find((p) => p.id === article.id);
    product.quantity -= article.qty;
  });
  clearCart();
  printSelectedProducts();
  printCart();
}

function checkButtons() {
  if (cart.length > 0) {
    document.getElementById("cart-checkout").removeAttribute("disabled");
    document.getElementById("cart-clear").removeAttribute("disabled");
  } else {
    document
      .getElementById("cart-checkout")
      .setAttribute("disabled", "disabled");
    document.getElementById("cart-clear").setAttribute("disabled", "disabled");
  }
}

function numberToCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

//   Add events to the buttons
productContainer.addEventListener("click", function (e) {
  const add = e.target.closest(".selection__button");
  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }
});

cartContainer.addEventListener("click", function (e) {
  const remove = e.target.closest(".remove-from-cart");
  const add = e.target.closest(".add-to-cart");
  const deleteCart = e.target.closest(".cart-remove");

  if (remove) {
    const id = +remove.dataset.id;
    removeFromCart(id);
  }

  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }

  if (deleteCart) {
    const id = +deleteCart.dataset.id;
    deleteFromCart(id);
  }
});

const actionButtons = document.getElementById("action-buttons");
actionButtons.addEventListener("click", function (e) {
  const clear = e.target.closest("#cart-clear");
  const buy = e.target.closest("#cart-checkout");

  if (clear) {
    openModal2()
  }

  if (buy) {
    checkout();
  }
});

//   Modal

let modal = document.getElementById("modal-window");
let button = document.getElementById("cart-checkout");
let span = document.getElementsByClassName("close")[0];

function openModal() {
  button.addEventListener("click", function () {
    modal.style.display = "block";
  });
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function openModal2() {
  let modal2 = document.getElementById("modal-window-2");
  let button2 = document.getElementById("cart-clear");
  let span2 = document.getElementsByClassName("close")[1];
  let span2a = document.getElementsByClassName("stay")[0];

  button2.addEventListener("click", function () {
    modal2.style.display = "block";
  });
  span2.addEventListener("click", function () {
    modal2.style.display = "none";
    clearCart()
  });
  span2a.addEventListener("click", function() {
    modal2.style.display = "none";
    printCart();
  })
  window.addEventListener("click", function (event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  });
}

openModal();
openModal2();

