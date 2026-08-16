/* =====================================================
   MiniMart - Product Listing page logic (products.html)
   Also powers the featured products section on index.html
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("products");
    renderFooter();

    const grid = document.getElementById("productGrid");
    if (grid) {
        loadProducts();

        const searchForm = document.getElementById("searchForm");
        if (searchForm) {
            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const keyword = document.getElementById("searchInput").value.trim();
                loadProducts(keyword);
            });
        }
    }

    const featuredGrid = document.getElementById("featuredGrid");
    if (featuredGrid) {
        loadFeaturedProducts();
    }
});

async function loadProducts(search = "") {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = `<p class="text-muted">Loading products...</p>`;
    try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const products = await apiRequest(`/products${query}`);
        renderProductGrid(products, grid);
    } catch (err) {
        grid.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

async function loadFeaturedProducts() {
    const grid = document.getElementById("featuredGrid");
    try {
        const products = await apiRequest("/products");
        renderProductGrid(products.slice(0, 4), grid);
    } catch (err) {
        grid.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderProductGrid(products, grid) {
    if (!products || products.length === 0) {
        grid.innerHTML = `<p class="text-muted">No products found.</p>`;
        return;
    }

    grid.innerHTML = products.map(p => `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card product-card">
          <a href="product-details.html?id=${p.id}">
            <img src="${p.imageUrl || 'https://picsum.photos/400/300'}" class="card-img-top" alt="${p.productName}">
          </a>
          <div class="card-body d-flex flex-column">
            <span class="badge category-badge mb-2 align-self-start">${p.category || "General"}</span>
            <h6 class="card-title">
              <a href="product-details.html?id=${p.id}" class="text-decoration-none text-dark">${p.productName}</a>
            </h6>
            <p class="product-price mb-2">${formatCurrency(p.price)}</p>
            <p class="small text-muted mb-2">${p.quantity > 0 ? p.quantity + " in stock" : "Out of stock"}</p>
            <button class="btn btn-brand btn-sm mt-auto" ${p.quantity <= 0 ? "disabled" : ""} onclick="quickAddToCart(${p.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join("");
}

async function quickAddToCart(productId) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    try {
        await apiRequest("/cart/add", "POST", { userId: user.userId, productId: productId, quantity: 1 });
        alert("Product added to cart!");
    } catch (err) {
        alert(err.message);
    }
}
