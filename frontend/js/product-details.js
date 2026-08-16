/* =====================================================
   MiniMart - Product Details page logic (product-details.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("products");
    renderFooter();
    loadProductDetails();
});

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadProductDetails() {
    const container = document.getElementById("productDetailsContainer");
    const id = getProductIdFromUrl();

    if (!id) {
        container.innerHTML = `<div class="alert alert-danger">No product specified.</div>`;
        return;
    }

    try {
        const p = await apiRequest(`/products/${id}`);
        container.innerHTML = `
          <div class="col-md-5">
            <img src="${p.imageUrl || 'https://picsum.photos/500/400'}" class="img-fluid rounded shadow-sm" alt="${p.productName}">
          </div>
          <div class="col-md-7">
            <span class="badge category-badge mb-2">${p.category || "General"}</span>
            <h2>${p.productName}</h2>
            <p class="text-muted">${p.description || "No description available."}</p>
            <p class="product-price fs-3">${formatCurrency(p.price)}</p>
            <p class="mb-3">${p.quantity > 0 ? `<span class="text-success">${p.quantity} in stock</span>` : `<span class="text-danger">Out of stock</span>`}</p>

            <div class="d-flex align-items-center gap-2 mb-3">
              <label class="me-2">Quantity:</label>
              <input type="number" id="qtyInput" class="form-control" style="width:100px;" value="1" min="1" max="${p.quantity}">
            </div>

            <button class="btn btn-brand btn-lg" ${p.quantity <= 0 ? "disabled" : ""} onclick="addToCart(${p.id})">
              Add to Cart
            </button>
            <a href="products.html" class="btn btn-outline-secondary btn-lg ms-2">Back to Products</a>
          </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

async function addToCart(productId) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    const qty = parseInt(document.getElementById("qtyInput").value) || 1;

    try {
        await apiRequest("/cart/add", "POST", { userId: user.userId, productId: productId, quantity: qty });
        alert("Product added to cart!");
        window.location.href = "cart.html";
    } catch (err) {
        alert(err.message);
    }
}
