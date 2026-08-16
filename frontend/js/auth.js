/* =====================================================
   MiniMart - Login & Register page logic
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar("");
    renderFooter();

    // If already logged in, skip login/register pages
    const user = getCurrentUser();
    if (user && (window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("register.html"))) {
        window.location.href = "index.html";
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await apiRequest("/users/login", "POST", { email, password });
        saveCurrentUser(response);
        window.location.href = response.role === "ADMIN" ? "admin.html" : "index.html";
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role") ? document.getElementById("role").value : "USER";

    try {
        const response = await apiRequest("/users/register", "POST", { name, email, password, role });
        saveCurrentUser(response);
        showAlert("alertBox", "Registration successful! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = response.role === "ADMIN" ? "admin.html" : "index.html";
        }, 800);
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}
