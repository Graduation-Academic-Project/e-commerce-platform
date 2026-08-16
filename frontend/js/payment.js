/* =====================================================
   MiniMart - Dummy Payment page logic (payment.html)
   NOTE: No real payment gateway is used. This simply simulates
   a payment, always resulting in "Payment Successful", then
   saves the order in the database.
   ===================================================== */

let selectedMethod = "COD";

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("cart");
    renderFooter();
    const user = requireLogin();

    const checkoutDetails = JSON.parse(sessionStorage.getItem("minimart_checkout") || "null");
    if (!checkoutDetails) {
        // User skipped checkout step - send them back
        window.location.href = "checkout.html";
        return;
    }

    loadOrderSummary(user);
    setupPaymentOptionToggle();

    document.getElementById("payNowBtn").addEventListener("click", () => handlePayNow(user, checkoutDetails));
});

async function loadOrderSummary(user) {
    const container = document.getElementById("paymentSummaryItems");
    const totalBox = document.getElementById("paymentTotal");

    try {
        const cartItems = await apiRequest(`/cart/${user.userId}`);
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

        totalBox.innerHTML = `<div class="d-flex justify-content-between fs-4 fw-bold mt-3">
                                 <span>Total Payable</span><span>${formatCurrency(total)}</span>
                               </div>`;
    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function setupPaymentOptionToggle() {
    const options = document.querySelectorAll(".payment-option");
    options.forEach(opt => {
        opt.addEventListener("click", () => {
            options.forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            selectedMethod = opt.dataset.method;

            document.getElementById("codFields").classList.toggle("d-none", selectedMethod !== "COD");
            document.getElementById("cardFields").classList.toggle("d-none", selectedMethod !== "DEBIT_CARD");
            document.getElementById("upiFields").classList.toggle("d-none", selectedMethod !== "UPI");
        });
    });
    // Default selection
    options[0].click();
}

function validatePaymentFields() {
    if (selectedMethod === "DEBIT_CARD") {
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const expiry = document.getElementById("cardExpiry").value.trim();
        const cvv = document.getElementById("cardCvv").value.trim();
        if (!cardNumber || !expiry || !cvv) {
            alert("Please fill in all card details (this is a dummy form, any values work).");
            return false;
        }
    } else if (selectedMethod === "UPI") {
        const upiId = document.getElementById("upiId").value.trim();
        if (!upiId) {
            alert("Please enter a UPI ID (this is a dummy form, any value works).");
            return false;
        }
    }
    return true;
}

async function handlePayNow(user, checkoutDetails) {
    if (!validatePaymentFields()) return;

    const payNowBtn = document.getElementById("payNowBtn");
    payNowBtn.disabled = true;
    payNowBtn.textContent = "Processing...";

    try {
        const orderPayload = {
            userId: user.userId,
            customerName: checkoutDetails.customerName,
            address: checkoutDetails.address,
            mobileNumber: checkoutDetails.mobileNumber,
            paymentMethod: selectedMethod
        };

        // Backend creates Order + OrderItems + a dummy SUCCESS Payment record, then clears the cart
        await apiRequest("/orders/place", "POST", orderPayload);

        document.getElementById("paymentResultBox").innerHTML =
            `<div class="alert alert-success text-center fs-5">✅ Payment Successful!</div>`;

        sessionStorage.removeItem("minimart_checkout");

        setTimeout(() => {
            window.location.href = "orders.html";
        }, 1500);
    } catch (err) {
        alert(err.message);
        payNowBtn.disabled = false;
        payNowBtn.textContent = "Pay Now";
    }
}
