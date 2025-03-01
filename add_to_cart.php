<?php
session_start();
require_once 'includes/db_connection.php';
require_once 'includes/functions.php';

// Check if product_id is set
if (!isset($_POST['product_id'])) {
    header("Location: products.php");
    exit();
}

$product_id = (int)$_POST['product_id'];
$quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;

// Ensure quantity is at least 1
if ($quantity < 1) {
    $quantity = 1;
}

// Check if product exists
$query = "SELECT * FROM products WHERE id = $product_id";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) == 0) {
    // Product doesn't exist
    header("Location: products.php");
    exit();
}

$product = mysqli_fetch_assoc($result);

// Check if user is logged in
if (is_logged_in()) {
    $user_id = $_SESSION['user_id'];
    
    // Check if product is already in cart
    $query = "SELECT * FROM cart WHERE user_id = $user_id AND product_id = $product_id";
    $result = mysqli_query($conn, $query);
    
    if (mysqli_num_rows($result) > 0) {
        // Update quantity
        $cart_item = mysqli_fetch_assoc($result);
        $new_quantity = $cart_item['quantity'] + $quantity;
        
        $query = "UPDATE cart SET quantity = $new_quantity, updated_at = NOW() WHERE id = {$cart_item['id']}";
        mysqli_query($conn, $query);
    } else {
        // Add new item to cart
        $query = "INSERT INTO cart (user_id, product_id, quantity) VALUES ($user_id, $product_id, $quantity)";
        mysqli_query($conn, $query);
    }
    
    // Update cart count in session
    $query = "SELECT SUM(quantity) as total FROM cart WHERE user_id = $user_id";
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_assoc($result);
    $_SESSION['cart_count'] = $row['total'] ?? 0;
    
} else {
    // For non-logged in users, use session cart
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    $found = false;
    
    // Check if product is already in cart
    foreach ($_SESSION['cart'] as &$item) {
        if ($item['product_id'] == $product_id) {
            $item['quantity'] += $quantity;
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        // Add new item to cart
        $_SESSION['cart'][] = [
            'product_id' => $product_id,
            'name' => $product['name'],
            'price' => $product['price'],
            'quantity' => $quantity
        ];
    }
    
    // Update cart count in session
    $total = 0;
    foreach ($_SESSION['cart'] as $item) {
        $total += $item['quantity'];
    }
    $_SESSION['cart_count'] = $total;
}

// Redirect back to products page or to cart
$redirect = isset($_POST['redirect']) ? $_POST['redirect'] : 'products.php';
header("Location: $redirect");
exit();
?>