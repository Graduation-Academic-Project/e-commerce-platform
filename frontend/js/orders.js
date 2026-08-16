/* =====================================================
   MiniMart - Order History page logic (orders.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("");
    renderFooter();
    const user = requireLogin();
    loadOrders(user);
});

async function loadOrders(user) {
    const container = document.getElementById("ordersContainer");
    container.innerHTML = `<p class="text-muted">Loading orders...</p>`;

    try {
        const orders = await apiRequest(`/orders/user/${user.userId}`);

        if (!orders || orders.length === 0) {
            container.innerHTML = `<div class="alert alert-info">You have no orders yet. <a href="products.html">Start shopping</a></div>`;
            return;
        }

        const cardsHtml = await Promise.all(orders.map(renderOrderCard));
        container.innerHTML = cardsHtml.join("");
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

async function renderOrderCard(order) {
    let itemsHtml = "";
    try {
        const items = await apiRequest(`/orders/${order.id}/items`);
        itemsHtml = items.map(i =>
            `<li>${i.productName} &times; ${i.quantity} — ${formatCurrency(i.price * i.quantity)}</li>`
        ).join("");
    } catch (e) {
        itemsHtml = "<li class='text-muted'>Could not load items</li>";
    }

    const orderDate = new Date(order.orderDate).toLocaleString();

    return `
      <div class="card order-card mb-3 p-3">
        <div class="d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h6 class="mb-1">Order #${order.id}</h6>
            <small class="text-muted">${orderDate}</small>
          </div>
          <span class="badge status-${order.status} align-self-center">${order.status}</span>
        </div>
        <ul class="mt-3 mb-2">${itemsHtml}</ul>
        <div class="d-flex justify-content-between border-top pt-2">
          <span>Payment: <strong>${order.paymentMethod}</strong></span>
          <span class="fw-bold">${formatCurrency(order.totalAmount)}</span>
        </div>
        <div class="small text-muted mt-2">
          Shipping to: ${order.customerName}, ${order.address} (${order.mobileNumber})
        </div>
      </div>
    `;
}
