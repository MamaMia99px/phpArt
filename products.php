<?php
session_start();
require_once 'includes/db_connection.php';
require_once 'includes/functions.php';

// Get category filter if set
$category = isset($_GET['category']) ? $_GET['category'] : '';
$search = isset($_GET['search']) ? sanitize_input($_GET['search']) : '';

// Build query based on filters
$query = "SELECT * FROM products WHERE 1=1";

if (!empty($category)) {
    $query .= " AND category = '$category'";
}

if (!empty($search)) {
    $query .= " AND (name LIKE '%$search%' OR description LIKE '%$search%')";
}

$query .= " ORDER BY name ASC";

// Execute query
$result = mysqli_query($conn, $query);
$products = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Products - ArtiSell</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50">
  <div id="root">
    <?php include 'includes/header.php'; ?>

    <main class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Products</h1>
        
        <div class="w-full md:w-auto">
          <form action="" method="GET" class="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              name="search" 
              placeholder="Search products..." 
              value="<?php echo $search; ?>"
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <select 
              name="category" 
              class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="arts" <?php echo $category === 'arts' ? 'selected' : ''; ?>>Arts</option>
              <option value="crafts" <?php echo $category === 'crafts' ? 'selected' : ''; ?>>Crafts</option>
              <option value="food" <?php echo $category === 'food' ? 'selected' : ''; ?>>Traditional Foods</option>
            </select>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      <?php if (empty($products)): ?>
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <p class="text-gray-500 text-lg">No products found matching your criteria.</p>
          <a href="products.php" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">View All Products</a>
        </div>
      <?php else: ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <?php foreach ($products as $product): ?>
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div class="h-48 bg-gray-200 flex items-center justify-center">
                <?php if (!empty($product['image']) && file_exists($product['image'])): ?>
                  <img src="<?php echo $product['image']; ?>" alt="<?php echo $product['name']; ?>" class="object-cover h-full w-full">
                <?php else: ?>
                  <div class="text-gray-400 flex items-center justify-center h-full w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                <?php endif; ?>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <h2 class="text-lg font-semibold text-gray-800"><?php echo $product['name']; ?></h2>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    <?php echo ucfirst($product['category']); ?>
                  </span>
                </div>
                <p class="text-gray-600 mt-2 text-sm line-clamp-2"><?php echo $product['description']; ?></p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900">$<?php echo number_format($product['price'], 2); ?></span>
                  <form action="add_to_cart.php" method="POST">
                    <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                    <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Add to Cart
                    </button>
                  </form>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </main>

    <?php include 'includes/footer.php'; ?>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>