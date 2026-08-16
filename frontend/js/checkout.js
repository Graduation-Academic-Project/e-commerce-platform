/* =====================================================
   MiniMart - Checkout page logic (checkout.html)
   Collects shipping details, then hands off to payment.html
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("cart");
    renderFooter();
    const user = requireLogin();
    loadCheckoutSummary(user);

    const form = document.getElementById("checkoutForm");
    if (form) {
        form.addEventListener("submit", handleCheckoutSubmit);
    }
});

async function loadCheckoutSummary(user) {
    const container = document.getElementById("checkoutItems");
    const totalBox = document.getElementById("checkoutTotal");

    try {
        const cartItems = await apiRequest(`/cart/${user.userId}`);

        if (!cartItems || cartItems.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">Your cart is empty. <a href="products.html">Add some products first</a></div>`;
            document.getElementById("checkoutForm").querySelector("button[type=submit]").disabled = true;
            return;
        }

        const detailedItems = await Promise.all(cartItems.map(async (item) => {
            const product = await apiRequest(`/products/${item.productId}`);
            return { ...item, product };
        }));

        let total = 0;
        container.innerHTML = detailedItems.map(item => {
            const lineTotal = item.product.price * item.quantity;
            total += lineTotal;
            return `<div class="d-flex justify-content-between border-bottom py-2">
                       <span>${item.product.productName} x ${item.quantity}</span>
                       <span>${formatCurrency(lineTotal)}</span>
                     </div>`;
        }).join("");

        totalBox.innerHTML = `<div class="d-flex justify-content-between fs-5 fw-bold mt-3">
                                 <span>Total Amount</span><span>${formatCurrency(total)}</span>
                               </div>`;
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const checkoutDetails = {
        customerName: document.getElementById("customerName").value.trim(),
        address: document.getElementById("address").value.trim(),
        mobileNumber: document.getElementById("mobileNumber").value.trim()
    };

    if (!checkoutDetails.customerName || !checkoutDetails.address || !checkoutDetails.mobileNumber) {
        showAlert("alertBox", "Please fill in all shipping details.");
        return;
    }

    // Temporarily store shipping details for the payment page to use
    sessionStorage.setItem("minimart_checkout", JSON.stringify(checkoutDetails));
    window.location.href = "payment.html";
}
