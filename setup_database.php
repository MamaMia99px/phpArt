<?php
// Database connection parameters
$host = 'localhost';
$username = 'root'; // Default XAMPP username
$password = ''; // Default XAMPP password is empty

// Create connection
$conn = mysqli_connect($host, $username, $password);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS artisell_db";
if (mysqli_query($conn, $sql)) {
    echo "<p>Database created successfully</p>";
} else {
    echo "<p>Error creating database: " . mysqli_error($conn) . "</p>";
}

// Select the database
mysqli_select_db($conn, "artisell_db");

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if (mysqli_query($conn, $sql)) {
    echo "<p>Users table created successfully</p>";
} else {
    echo "<p>Error creating users table: " . mysqli_error($conn) . "</p>";
}

// Create products table
$sql = "CREATE TABLE IF NOT EXISTS products (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category ENUM('arts', 'crafts', 'food') NOT NULL,
    stock INT(11) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if (mysqli_query($conn, $sql)) {
    echo "<p>Products table created successfully</p>";
} else {
    echo "<p>Error creating products table: " . mysqli_error($conn) . "</p>";
}

// Create orders table
$sql = "CREATE TABLE IF NOT EXISTS orders (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

if (mysqli_query($conn, $sql)) {
    echo "<p>Orders table created successfully</p>";
} else {
    echo "<p>Error creating orders table: " . mysqli_error($conn) . "</p>";
}

// Create order_items table
$sql = "CREATE TABLE IF NOT EXISTS order_items (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT(11) UNSIGNED NOT NULL,
    product_id INT(11) UNSIGNED NOT NULL,
    quantity INT(11) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)";

if (mysqli_query($conn, $sql)) {
    echo "<p>Order items table created successfully</p>";
} else {
    echo "<p>Error creating order items table: " . mysqli_error($conn) . "</p>";
}

// Create cart table
$sql = "CREATE TABLE IF NOT EXISTS cart (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    product_id INT(11) UNSIGNED NOT NULL,
    quantity INT(11) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY user_product (user_id, product_id)
)";

if (mysqli_query($conn, $sql)) {
    echo "<p>Cart table created successfully</p>";
} else {
    echo "<p>Error creating cart table: " . mysqli_error($conn) . "</p>";
}

// Insert sample products
$sql = "INSERT INTO products (name, description, price, image, category, stock) VALUES
    ('Cebu Landscape Painting', 'Beautiful handpainted landscape of Cebu mountains', 150.00, 'images/products/landscape1.jpg', 'arts', 5),
    ('Handwoven Basket', 'Traditional Cebuano basket made from local materials', 45.00, 'images/products/basket1.jpg', 'crafts', 12),
    ('Dried Mangoes', 'Sweet dried mangoes from Cebu', 8.50, 'images/products/mangoes.jpg', 'food', 50),
    ('Shell Necklace', 'Handcrafted necklace made from local shells', 35.00, 'images/products/necklace1.jpg', 'crafts', 8),
    ('Cebu Portrait', 'Portrait painting of Cebuano culture', 120.00, 'images/products/portrait1.jpg', 'arts', 3),
    ('Otap Cookies', 'Traditional Cebuano oval-shaped cookies', 6.75, 'images/products/otap.jpg', 'food', 30)";

// Check if products already exist to avoid duplicates
$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM products");
$row = mysqli_fetch_assoc($result);

if ($row['count'] == 0) {
    if (mysqli_query($conn, $sql)) {
        echo "<p>Sample products added successfully</p>";
    } else {
        echo "<p>Error adding sample products: " . mysqli_error($conn) . "</p>";
    }
} else {
    echo "<p>Products already exist, skipping sample data insertion</p>";
}

echo "<p>Database setup complete! <a href='index.php'>Go to homepage</a></p>";

// Close connection
mysqli_close($conn);
?>