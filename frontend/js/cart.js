/* =====================================================
   MiniMart - Shopping Cart page logic (cart.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("cart");
    renderFooter();
    requireLogin();
    loadCart();
});

async function loadCart() {
    const user = getCurrentUser();
    const container = document.getElementById("cartContainer");
    const summaryBox = document.getElementById("cartSummary");
    container.innerHTML = `<p class="text-muted">Loading cart...</p>`;

    try {
        const cartItems = await apiRequest(`/cart/${user.userId}`);

        if (!cartItems || cartItems.length === 0) {
            container.innerHTML = `<div class="alert alert-info">Your cart is empty. <a href="products.html">Browse products</a></div>`;
            summaryBox.innerHTML = "";
            return;
        }

        // Fetch product details for each cart line (needed since cart only stores productId)
        const detailedItems = await Promise.all(cartItems.map(async (item) => {
            const product = await apiRequest(`/products/${item.productId}`);
            return { ...item, product };
        }));

        renderCartItems(detailedItems, container);
        renderCartSummary(detailedItems, summaryBox);
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderCartItems(items, container) {
    container.innerHTML = items.map(item => `
      <div class="card cart-item-row mb-3 p-3">
        <div class="row align-items-center">
          <div class="col-2">
            <img src="${item.product.imageUrl}" class="img-fluid rounded" alt="${item.product.productName}">
          </div>
          <div class="col-4">
            <h6 class="mb-1">${item.product.productName}</h6>
            <small class="text-muted">${formatCurrency(item.product.price)} each</small>
          </div>
          <div class="col-3">
            <input type="number" min="1" class="form-control" value="${item.quantity}"
                   onchange="updateCartQuantity(${item.id}, this.value)">
          </div>
          <div class="col-2">
            <strong>${formatCurrency(item.product.price * item.quantity)}</strong>
          </div>
          <div class="col-1">
            <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${item.id})">&times;</button>
          </div>
        </div>
      </div>
    `).join("");
}

function renderCartSummary(items, summaryBox) {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    summaryBox.innerHTML = `
      <div class="card form-card">
        <h5 class="section-title">Order Summary</h5>
        <div class="d-flex justify-content-between mb-2">
          <span>Items</span><span>${items.length}</span>
        </div>
        <div class="d-flex justify-content-between fs-5 fw-bold mb-3">
          <span>Total</span><span>${formatCurrency(total)}</span>
        </div>
        <a href="checkout.html" class="btn btn-brand w-100">Proceed to Checkout</a>
      </div>
    `;
}

async function updateCartQuantity(cartId, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) quantity = 1;
    try {
        await apiRequest(`/cart/update/${cartId}`, "PUT", { quantity });
        loadCart();
    } catch (err) {
        alert(err.message);
    }
}

async function removeCartItem(cartId) {
    if (!confirm("Remove this item from cart?")) return;
    try {
        await apiRequest(`/cart/${cartId}`, "DELETE");
        loadCart();
    } catch (err) {
        alert(err.message);
    }
}
