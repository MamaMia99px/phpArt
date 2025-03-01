<?php
session_start();
require_once 'includes/db_connection.php';
require_once 'includes/functions.php';

// Check if user is logged in
if (!is_logged_in()) {
    header("Location: index.php");
    exit();
}

// Get user information
$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard - ArtiSell</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50">
  <div id="root">
    <?php include 'includes/header.php'; ?>

    <main class="container mx-auto px-4 py-8">
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Welcome, <?php echo $user_name; ?>!</h1>
        <p class="text-gray-600">This is your dashboard where you can manage your account and view your orders.</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">My Profile</h2>
          <p class="text-gray-600 mb-4">Manage your personal information and preferences.</p>
          <a href="profile.php" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</a>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">My Orders</h2>
          <p class="text-gray-600 mb-4">View your order history and track current orders.</p>
          <a href="orders.php" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Orders</a>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Saved Items</h2>
          <p class="text-gray-600 mb-4">Products you've saved for later.</p>
          <a href="saved_items.php" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Saved Items</a>
        </div>
      </div>

      <div class="mt-8 bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div class="border-t border-gray-200 pt-4">
          <p class="text-gray-500 italic">No recent activity to display.</p>
          <!-- In a real app, you would display recent orders, reviews, etc. -->
        </div>
      </div>
    </main>

    <?php include 'includes/footer.php'; ?>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>