# MiniMart - Simple E-Commerce Application

A small, clean, full-stack e-commerce demo application built for a college/project evaluation.
Developed by a team of 2 members.

---

## 1. Project Description

MiniMart is a simple online store that lets users browse products, add them to a cart, check
out with shipping details, "pay" using a dummy payment simulator (Cash on Delivery, Dummy Debit
Card, or Dummy UPI), and view their order history. Admins can manage the product catalog and
update order statuses.

The project intentionally avoids complex/production concerns (JWT, microservices, Docker, real
payment gateways, cloud hosting) so it stays easy to build, run, and explain in an interview.

---

## 2. Features

**User**
- Register and login (session stored in browser `localStorage`)
- Browse all products, search by name/category, view product details
- Add products to cart, update quantity, remove items
- Checkout with name, address, and mobile number
- Choose a dummy payment method (COD / Debit Card / UPI) and "pay"
- View personal order history with item-level details and order status

**Admin**
- Add, update, and delete products
- View all orders placed by all users
- Update order status (PLACED → SHIPPED → DELIVERED)

---

## 3. Technology Used

**Frontend**
- HTML5, CSS3, Vanilla JavaScript (no frameworks)
- Bootstrap 5 (via CDN)
- Fetch API for calling REST endpoints

**Backend**
- Java 17
- Spring Boot 3.x (Spring Web, Spring Data JPA)
- Hibernate (JPA implementation)
- Maven

**Database**
- MySQL 8

---

## 4. Software Requirements

Install the following before running the project:

| Tool             | Version (minimum) |
|-------------------|-------------------|
| JDK               | 17                |
| Maven             | 3.8+              |
| MySQL Server      | 8.0               |
| A modern browser  | Chrome / Edge / Firefox |
| (Optional) VS Code + Live Server extension, for the frontend |

---

## 5. MySQL Setup

1. Start your local MySQL server.
2. Open a MySQL client (MySQL Workbench, `mysql` CLI, or DBeaver).
3. Run the script located at `database/minimart_db.sql`:

   ```bash
   mysql -u root -p < database/minimart_db.sql
   ```

   This will:
   - Create the `minimart_db` database
   - Create all required tables (`users`, `products`, `cart`, `orders`, `order_items`, `payments`)
   - Insert sample users and sample products

---

## 6. Backend Setup

1. Open a terminal and navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Open `src/main/resources/application.properties` and update the MySQL
   username/password to match your local setup:

   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. Build and run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

4. The backend will start at:

   ```
   http://localhost:8080
   ```

   All REST APIs are available under `http://localhost:8080/api`.

> Note: `spring.jpa.hibernate.ddl-auto=update` is set, so Hibernate will also
> auto-create/update tables based on the entities if you skip step in Section 5 -
> however running the SQL script first is recommended since it also inserts sample data.

---

## 7. Frontend Setup

The frontend is plain HTML/CSS/JS, so no build step is required.

**Option A - Open directly**
- Simply open `frontend/index.html` in your browser.

**Option B - VS Code Live Server (recommended)**
1. Open the `frontend` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

> Make sure the backend (`mvn spring-boot:run`) is already running on port 8080,
> since the frontend calls `http://localhost:8080/api` for all data.

---

## 8. API Documentation

### User APIs
| Method | Endpoint              | Description          |
|--------|------------------------|-----------------------|
| POST   | `/api/users/register`  | Register a new user  |
| POST   | `/api/users/login`     | Login a user          |

### Product APIs
| Method | Endpoint                        | Description                         |
|--------|----------------------------------|--------------------------------------|
| GET    | `/api/products`                 | Get all products                     |
| GET    | `/api/products?search=keyword`  | Search products by name/category     |
| GET    | `/api/products/{id}`            | Get a single product by id           |
| POST   | `/api/products`                 | Add a new product (Admin)            |
| PUT    | `/api/products/{id}`            | Update an existing product (Admin)   |
| DELETE | `/api/products/{id}`            | Delete a product (Admin)             |

### Cart APIs
| Method | Endpoint                  | Description                     |
|--------|-----------------------------|----------------------------------|
| POST   | `/api/cart/add`             | Add a product to a user's cart  |
| GET    | `/api/cart/{userId}`        | Get all cart items for a user   |
| PUT    | `/api/cart/update/{id}`     | Update quantity of a cart item  |
| DELETE | `/api/cart/{id}`            | Remove an item from the cart    |

### Order APIs
| Method | Endpoint                     | Description                                    |
|--------|-------------------------------|-------------------------------------------------|
| POST   | `/api/orders/place`           | Place an order from the current cart (checkout + dummy payment) |
| GET    | `/api/orders/user/{userId}`   | Get order history for a user                    |
| GET    | `/api/orders/{orderId}/items` | Get line items for a specific order              |
| GET    | `/api/orders`                 | Get all orders (Admin)                           |
| PUT    | `/api/orders/status/{id}`     | Update an order's status (Admin)                 |

---

## 9. Sample Login Credentials

| Role  | Email                | Password |
|-------|------------------------|----------|
| Admin | admin@minimart.com    | admin123 |
| User  | john@example.com      | john123  |
| User  | jane@example.com      | jane123  |

You can also register new accounts from the Register page (choose "Admin" or "User" role).

---

## Project Folder Structure

```
MiniMart/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── payment.html
│   ├── orders.html
│   ├── admin.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── product-details.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── payment.js
│   │   ├── orders.js
│   │   └── admin.js
│   └── images/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/minimart/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── exception/
│       └── config/
├── database/
│   └── minimart_db.sql
└── README.md
```

---

## Important Notes (for interview / evaluation)

- Passwords are stored as plain text and login state is kept in `localStorage`
  purely to keep the project simple - this is **not** secure enough for production
  (a real app would hash passwords and use JWT/session-based auth).
- Payments are entirely simulated - no real payment gateway (Razorpay/Stripe/etc.)
  is integrated. Selecting any payment method and clicking "Pay Now" always
  succeeds and simply records a `SUCCESS` payment row in the database.
- The project follows a standard layered Spring Boot architecture
  (Controller → Service → Repository → Entity) to keep responsibilities clear
  and easy to explain.
