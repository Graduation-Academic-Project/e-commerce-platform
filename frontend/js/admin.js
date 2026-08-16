/* =====================================================
   MiniMart - Admin Panel logic (admin.html)
   Handles: product CRUD + viewing/updating all orders
   ===================================================== */

let editingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("admin");
    renderFooter();
    requireAdmin();

    loadAdminProducts();
    loadAdminOrders();

    document.getElementById("productForm").addEventListener("submit", handleProductFormSubmit);
    document.getElementById("resetFormBtn").addEventListener("click", resetProductForm);
});

/* ---------------- Product Management ---------------- */

async function loadAdminProducts() {
    const tableBody = document.getElementById("adminProductsTable");
    tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">Loading...</td></tr>`;

    try {
        const products = await apiRequest("/products");
        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">No products yet.</td></tr>`;
            return;
        }
        tableBody.innerHTML = products.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.productName}</td>
            <td>${p.category || "-"}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.quantity}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${p.id})">Edit</button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
          </tr>
        `).join("");
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">${err.message}</td></tr>`;
    }
}

async function editProduct(id) {
    try {
        const p = await apiRequest(`/products/${id}`);
        editingProductId = p.id;
        document.getElementById("productName").value = p.productName;
        document.getElementById("description").value = p.description || "";
        document.getElementById("price").value = p.price;
        document.getElementById("category").value = p.category || "";
        document.getElementById("quantity").value = p.quantity;
        document.getElementById("imageUrl").value = p.imageUrl || "";
        document.getElementById("formTitle").textContent = "Update Product";
        document.getElementById("submitProductBtn").textContent = "Update Product";
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
        alert(err.message);
    }
}

function resetProductForm() {
    editingProductId = null;
    document.getElementById("productForm").reset();
    document.getElementById("formTitle").textContent = "Add New Product";
    document.getElementById("submitProductBtn").textContent = "Add Product";
}

async function handleProductFormSubmit(e) {
    e.preventDefault();

    const product = {
        productName: document.getElementById("productName").value.trim(),
        description: document.getElementById("description").value.trim(),
        price: parseFloat(document.getElementById("price").value),
        category: document.getElementById("category").value.trim(),
        quantity: parseInt(document.getElementById("quantity").value),
        imageUrl: document.getElementById("imageUrl").value.trim()
    };

    try {
        if (editingProductId) {
            await apiRequest(`/products/${editingProductId}`, "PUT", product);
        } else {
            await apiRequest("/products", "POST", product);
        }
        resetProductForm();
        loadAdminProducts();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
        await apiRequest(`/products/${id}`, "DELETE");
        loadAdminProducts();
    } catch (err) {
        alert(err.message);
    }
}

/* ---------------- Order Management ---------------- */

async function loadAdminOrders() {
    const tableBody = document.getElementById("adminOrdersTable");
    tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">Loading...</td></tr>`;

    try {
        const orders = await apiRequest("/orders");
        if (orders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">No orders yet.</td></tr>`;
            return;
        }
        tableBody.innerHTML = orders.map(o => `
          <tr>
            <td>${o.id}</td>
            <td>${o.userId}</td>
            <td>${formatCurrency(o.totalAmount)}</td>
            <td>${o.paymentMethod}</td>
            <td><span class="badge status-${o.status}">${o.status}</span></td>
            <td>
              <select class="form-select form-select-sm" onchange="updateOrderStatus(${o.id}, this.value)">
                <option value="PLACED" ${o.status === "PLACED" ? "selected" : ""}>PLACED</option>
                <option value="SHIPPED" ${o.status === "SHIPPED" ? "selected" : ""}>SHIPPED</option>
                <option value="DELIVERED" ${o.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
              </select>
            </td>
          </tr>
        `).join("");
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">${err.message}</td></tr>`;
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await apiRequest(`/orders/status/${orderId}`, "PUT", { status });
        loadAdminOrders();
    } catch (err) {
        alert(err.message);
    }
}
