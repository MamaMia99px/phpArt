<?php
session_start();
require_once 'includes/db_connection.php';
require_once 'includes/functions.php';

$cart_items = [];
$total = 0;

// Get cart items
if (is_logged_in()) {
    $user_id = $_SESSION['user_id'];
    
    $query = "SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image 
              FROM cart c 
              JOIN products p ON c.product_id = p.id 
              WHERE c.user_id = $user_id";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $cart_items[] = $row;
            $total += $row['price'] * $row['quantity'];
        }
    }
} else {
    // For non-logged in users, use session cart
    if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $item) {
            // Get product details from database to ensure up-to-date info
            $product_id = $item['product_id'];
            $query = "SELECT id as product_id, name, price, image FROM products WHERE id = $product_id";
            $result = mysqli_query($conn, $query);
            
            if ($result && mysqli_num_rows($result) > 0) {
                $product = mysqli_fetch_assoc($result);
                $cart_item = [
                    'id' => 'session_' . $product_id, // Use a prefix to identify session items
                    'product_id' => $product_id,
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'image' => $product['image'],
                    'quantity' => $item['quantity']
                ];
                
                $cart_items[] = $cart_item;
                $total += $cart_item['price'] * $cart_item['quantity'];
            }
        }
    }
}

// Handle cart updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    
    if ($action === 'update' && isset($_POST['cart_id']) && isset($_POST['quantity'])) {
        $cart_id = $_POST['cart_id'];
        $quantity = (int)$_POST['quantity'];
        
        if ($quantity < 1) {
            $quantity = 1;
        }
        
        if (is_logged_in()) {
            // Update database cart
            if (is_numeric($cart_id)) { // Make sure it's a database ID
                $query = "UPDATE cart SET quantity = $quantity, updated_at = NOW() WHERE id = $cart_id AND user_id = {$_SESSION['user_id']}";
                mysqli_query($conn, $query);
            }
        } else {
            // Update session cart
            if (strpos($cart_id, 'session_') === 0) {
                $product_id = substr($cart_id, 8); // Remove 'session_' prefix
                
                foreach ($_SESSION['cart'] as &$item) {
                    if ($item['product_id'] == $product_id) {
                        $item['quantity'] = $quantity;
                        break;
                    }
                }
            }
        }
        
        // Redirect to refresh the page
        header("Location: cart.php");
        exit();
    }
    
    if ($action === 'remove' && isset($_POST['cart_id'])) {
        $cart_id = $_POST['cart_id'];
        
        if (is_logged_in()) {
            // Remove from database cart
            if (is_numeric($cart_id)) {
                $query = "DELETE FROM cart WHERE id = $cart_id AND user_id = {$_SESSION['user_id']}";
                mysqli_query($conn, $query);
            }
        } else {
            // Remove from session cart
            if (strpos($cart_id, 'session_') === 0) {
                $product_id = substr($cart_id, 8); // Remove 'session_' prefix
                
                foreach ($_SESSION['cart'] as $key => $item) {
                    if ($item['product_id'] == $product_id) {
                        unset($_SESSION['cart'][$key]);
                        // Re-index the array
                        $_SESSION['cart'] = array_values($_SESSION['cart']);
                        break;
                    }
                }
            }
        }
        
        // Redirect to refresh the page
        header("Location: cart.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shopping Cart - ArtiSell</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50">
  <div id="root">
    <?php include 'includes/header.php'; ?>

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <?php if (empty($cart_items)): ?>
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <p class="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <a href="products.php" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Browse Products</a>
        </div>
      <?php else: ?>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <?php foreach ($cart_items as $item): ?>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                            <?php if (!empty($item['image']) && file_exists($item['image'])): ?>
                              <img src="<?php echo $item['image']; ?>" alt="<?php echo $item['name']; ?>" class="h-full w-full object-cover">
                            <?php else: ?>
                              <div class="flex items-center justify-center h-full w-full text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                              </div>
                            <?php endif; ?>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900"><?php echo $item['name']; ?></div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">$<?php echo number_format($item['price'], 2); ?></div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <form method="POST" action="" class="flex items-center">
                          <input type="hidden" name="action" value="update">
                          <input type="hidden" name="cart_id" value="<?php echo $item['id']; ?>">
                          <input 
                            type="number" 
                            name="quantity" 
                            value="<?php echo $item['quantity']; ?>" 
                            min="1" 
                            class="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                          <button 
                            type="submit" 
                            class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            Update
                          </button>
                        </form>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">$<?php echo number_format($item['price'] * $item['quantity'], 2); ?></div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <form method="POST" action="">
                          <input type="hidden" name="action" value="remove">
                          <input type="hidden" name="cart_id" value="<?php echo $item['id']; ?>">
                          <button 
                            type="submit" 
                            class="text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-800 font-medium">$<?php echo number_format($total, 2); ?></span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Shipping</span>
                  <span class="text-gray-800 font-medium">$<?php echo number_format(10.00, 2); ?></span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Tax</span>
                  <span class="text-gray-800 font-medium">$<?php echo number_format($total * 0.12, 2); ?></span>
                </div>
                <div class="border-t border-gray-200 mt-4 pt-4">
                  <div class="flex justify-between">
                    <span class="text-lg font-semibold text-gray-800">Total</span>
                    <span class="text-lg font-semibold text-gray-800">$<?php echo number_format($total + 10.00 + ($total * 0.12), 2); ?></span>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <a 
                  href="<?php echo is_logged_in() ? 'checkout.php' : 'index.php?tab=login'; ?>" 
                  class="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <?php echo is_logged_in() ? 'Proceed to Checkout' : 'Login to Checkout'; ?>
                </a>
              </div>
              <div class="mt-4">
                <a 
                  href="products.php" 
                  class="w-full block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      <?php endif; ?>
    </main>

    <?php include 'includes/footer.php'; ?>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>