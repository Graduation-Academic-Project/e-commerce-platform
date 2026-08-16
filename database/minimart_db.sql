-- =====================================================
-- MiniMart - Simple E-Commerce Application
-- Database Creation Script (MySQL 8)
-- =====================================================

DROP DATABASE IF EXISTS minimart_db;
CREATE DATABASE minimart_db;
USE minimart_db;

-- =====================================================
-- Table: users
-- =====================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- =====================================================
-- Table: products
-- =====================================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(80),
    quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500)
);

-- =====================================================
-- Table: cart
-- =====================================================
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================================
-- Table: orders
-- =====================================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PLACED',
    payment_method VARCHAR(40),
    customer_name VARCHAR(100),
    address VARCHAR(255),
    mobile_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Table: order_items
-- =====================================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- Table: payments
-- =====================================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(40) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- Sample Data
-- =====================================================

-- Sample Users (password is plain text for this simple demo project)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@minimart.com', 'admin123', 'ADMIN'),
('John Doe', 'john@example.com', 'john123', 'USER'),
('Jane Smith', 'jane@example.com', 'jane123', 'USER');

-- Sample Products
INSERT INTO products (product_name, description, price, category, quantity, image_url) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 599.00, 'Electronics', 50, 'https://picsum.photos/seed/mouse/400/300'),
('Bluetooth Headphones', 'Over-ear Bluetooth headphones with noise cancellation', 2499.00, 'Electronics', 30, 'https://picsum.photos/seed/headphones/400/300'),
('Cotton T-Shirt', 'Comfortable 100% cotton round neck t-shirt', 399.00, 'Clothing', 100, 'https://picsum.photos/seed/tshirt/400/300'),
('Running Shoes', 'Lightweight running shoes with cushioned sole', 1999.00, 'Footwear', 40, 'https://picsum.photos/seed/shoes/400/300'),
('Coffee Mug', 'Ceramic coffee mug, 350ml capacity', 249.00, 'Home', 80, 'https://picsum.photos/seed/mug/400/300'),
('Backpack', 'Water-resistant laptop backpack, 20L capacity', 1299.00, 'Accessories', 25, 'https://picsum.photos/seed/backpack/400/300'),
('Desk Lamp', 'Adjustable LED desk lamp with 3 brightness modes', 899.00, 'Home', 35, 'https://picsum.photos/seed/lamp/400/300'),
('Notebook Set', 'Pack of 3 ruled notebooks, 100 pages each', 199.00, 'Stationery', 150, 'https://picsum.photos/seed/notebook/400/300');
