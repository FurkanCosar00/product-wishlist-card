import './App.css'

function App() {
  return (
    <div className="container">
      <ProductContainer />
      <ProductOrder />
      <Dialog />
    </div>
  )
}

function ProductContainer() {
  let menuProducts = [];
  let salesProduct = [];
  let salestotal = 0;

  function handleAddToCart() {
    let productId = Number(this.dataset.productid);
    let product = menuProducts.find((x) => x.id === productId);

    product.adet = product.adet ? product.adet + 1 : 1;
    product.toplam = product.price * product.adet;

    if (!salesProduct.includes(product)) {
      salesProduct.push(product);
    }

    this.innerHTML = `
      <div class="addNumberCart">
        <img src="../images/-.png" class="eksiNumber" alt="-">
        <p id="productsNumber">${product.adet}</p>
        <img src="../images/+.png" class="artiNumber" alt="+">
      </div>`;
    this.style.padding = "0px";

    updateCart();
  }

  function updateCart() {
    salestotal = salesProduct.reduce((total, current) => total + current.toplam, 0);
    orderAdd.innerText = `(${salesProduct.length})`;

    confirmProduct.innerHTML = `
      <div class="orderTotal">
        <h4>Order Total</h4>
        <p>$${salestotal}</p>
      </div>
      <div class="carbon">
        <img src="../images/carbon_tree.svg" alt="carbon tree">
        <p>This is a <span>carbon-neutral</span> delivery</p>
      </div>
      <button class="Confirm">Confirm Order</button>`;

    productOrder.innerHTML = salesProduct.map(CreateOrderHtml).join("");
    document.querySelectorAll(".deletebtn").forEach(x => x.addEventListener("click", handleDeleteCart));
    document.querySelectorAll(".Confirm").forEach(x => x.addEventListener("click", handleConfirmClick));
  }

  function handleDeleteCart() {
    salesProduct = salesProduct.filter(x => x.id !== Number(this.dataset.deleteid));
    updateCart();
  }

  function handleConfirmClick() {
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modalheader">
          <img src="../images/carbon_checkmark-outline.svg" alt="">
          <h1>Order Confirmed</h1>
          <p>We hope enjoy your food</p>
        </div>
        <div class="orderLast">
          <div class="modalPorductList" id="modalPorductList">
            ${salesProduct.map(CreateModalOrderHtml).join('')}
          </div>
          <div class="modalorderTotal">
            <h4>Order Total</h4>
            <p>$${salestotal}</p>
          </div>
        </div>
        <button class="newOrder">Start New Order</button>
      </div>`;
    document.querySelectorAll(".newOrder").forEach(x => x.addEventListener("click", handleNewOrderClick));
    modal.showModal();
  }

  function handleNewOrderClick() {
    salesProduct = [];
    modal.close();
    updateCart();
    renderProduct();
  }

  function createProductHtml(product) {
    return `
      <div class="product-item">
        <img src="${product.image.desktop}" class="desktop" alt="${product.image.desktop}">
        <div class="addTocart" data-productid="${product.id}">
          <img src="../images/carbon_shopping-cart-plus.svg" alt="Add to Cart">
          <p>Add to Cart</p>
        </div>
        <div class="product-text">
          <h4>${product.category}</h4>
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>
      </div>`;
  }

  function CreateOrderHtml(product) {
    return `
      <div class="order-item">
        <div class="order-text">
          <h5>${product.name}</h5>
          <p>${product.adet}x <span>@${product.price}</span> <span><b>$${product.toplam}</b></span></p>
        </div>
        <a href="#" class="deletebtn" data-deleteid="${product.id}"><img src="../images/removeBtn.png" alt=""></a>
      </div>`;
  }

  function CreateModalOrderHtml(product) {
    return `
      <div class="modal-order-item">
        <div class="modalproduct-info">
          <img src="${product.image.thumbnail}" alt="">
          <div class="modal-text">
            <h5>${product.name}</h5>
            <p>${product.adet}x <span>@${product.price}</span></p>
          </div>
        </div>
        <p class="modaltotal">$${product.toplam}</p>
      </div>`;
  }

  function renderProduct() {
    productList.innerHTML = menuProducts.map(createProductHtml).join("");
    document.querySelectorAll(".addTocart").forEach(x => x.addEventListener("click", handleAddToCart));
  }

  function init() {
    fetch("https://dummyjson.czaylabs.com.tr/api/products")
      .then(res => res.json())
      .then(res => {
        menuProducts = res.data;
        renderProduct();
      });
  }

  init();

  return (
    <div class="product-container">
      <img src="../images/Desserts.png" alt="dessert logosu" />
      <div class="product-list" id="productList"></div>
    </div>
  )
}

function ProductOrder() {
  return (
    <div class="product-order">
      <h2>Your Cart <span id="orderAdd">(0)</span></h2>
      <div id="productOrder" class="empty-order">
        <img src="../images/pasta.svg" alt="empty cart" />
        <p>Your added items will appear here</p>
      </div>
      <div id="confirmProduct" class="confirm-product"></div>
    </div>
  )
}

function Dialog() {
  return <dialog id="modal"></dialog>
}

export default App
