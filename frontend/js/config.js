/* =====================================================
   MiniMart - Global Config & Shared Helpers
   Loaded on every page BEFORE the page-specific JS file.
   ===================================================== */

// Base URL of the Spring Boot backend REST API
const API_BASE_URL = "http://localhost:8080/api";

/* ---------------- Auth helpers (localStorage based) ----------------
   Since this project does not use JWT, we simply store the logged-in
   user's details in localStorage after a successful login/register.
------------------------------------------------------------------- */

function saveCurrentUser(user) {
    localStorage.setItem("minimart_user", JSON.stringify(user));
}

function getCurrentUser() {
    const raw = localStorage.getItem("minimart_user");
    return raw ? JSON.parse(raw) : null;
}

function logoutUser() {
    localStorage.removeItem("minimart_user");
    window.location.href = "login.html";
}

// Redirects to login.html if no user is logged in. Call at the top of protected pages.
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    return user;
}

// Redirects to index.html if the logged-in user is not an ADMIN.
function requireAdmin() {
    const user = requireLogin();
    if (user && user.role !== "ADMIN") {
        alert("Access denied: Admins only");
        window.location.href = "index.html";
    }
    return user;
}

/* ---------------- Generic fetch wrapper ---------------- */

async function apiRequest(path, method = "GET", body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = (data && data.message) ? data.message : "Something went wrong. Please try again.";
        throw new Error(message);
    }
    return data;
}

/* ---------------- Shared Navbar ---------------- */

function renderNavbar(activePage = "") {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    const user = getCurrentUser();

    const link = (href, label, key) =>
        `<li class="nav-item"><a class="nav-link ${activePage === key ? "fw-bold text-decoration-underline" : ""}" href="${href}">${label}</a></li>`;

    let rightLinks = "";
    if (user) {
        rightLinks += `<li class="nav-item"><span class="nav-link">Hi, ${user.name}</span></li>`;
        if (user.role === "ADMIN") {
            rightLinks += link("admin.html", "Admin Panel", "admin");
        }
        rightLinks += `<li class="nav-item"><a class="nav-link" href="orders.html">My Orders</a></li>`;
        rightLinks += `<li class="nav-item"><button class="btn btn-sm btn-accent ms-2" onclick="logoutUser()">Logout</button></li>`;
    } else {
        rightLinks += `<li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>`;
        rightLinks += `<li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>`;
    }

    navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-minimart navbar-dark px-3 shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">🛒 MiniMart</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${link("index.html", "Home", "home")}
            ${link("products.html", "Products", "products")}
            ${link("cart.html", "Cart", "cart")}
          </ul>
          <ul class="navbar-nav align-items-lg-center">
            ${rightLinks}
          </ul>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;
    footerContainer.innerHTML = `
    <footer class="footer-minimart">
      <p class="mb-0">&copy; 2026 MiniMart - Simple E-Commerce Application | College Project</p>
    </footer>`;
}

function showAlert(containerId, message, type = "danger") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
}

function formatCurrency(amount) {
    return "₹" + Number(amount).toFixed(2);
}
