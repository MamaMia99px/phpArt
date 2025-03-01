<header class="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8 lg:px-12">
  <div class="flex items-center">
    <a href="index.php" class="flex items-center focus:outline-none">
      <img src="public/vite.svg" alt="ArtiSell Logo" class="h-10 w-10 mr-2" />
      <span class="text-xl font-bold text-blue-600">ArtiSell</span>
    </a>
    <div class="hidden md:flex ml-8 space-x-6">
      <a href="index.php" class="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
      <a href="products.php" class="text-gray-600 hover:text-blue-600 transition-colors">Products</a>
      <a href="about.php" class="text-gray-600 hover:text-blue-600 transition-colors">About</a>
      <a href="contact.php" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
    </div>
  </div>

  <div class="flex items-center space-x-4">
    <a href="cart.php" class="relative p-2 rounded-full hover:bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <?php if (isset($_SESSION['cart_count']) && $_SESSION['cart_count'] > 0): ?>
        <span class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          <?php echo $_SESSION['cart_count']; ?>
        </span>
      <?php else: ?>
        <span class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
      <?php endif; ?>
    </a>

    <div class="hidden md:block">
      <?php if (is_logged_in()): ?>
        <div class="flex items-center space-x-2">
          <a href="profile.php" class="text-gray-700 hover:text-blue-600"><?php echo $_SESSION['user_name']; ?></a>
          <a href="logout.php" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700">Logout</a>
        </div>
      <?php else: ?>
        <a href="index.php" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2">Sign In</a>
        <a href="index.php?tab=register" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Register</a>
      <?php endif; ?>
    </div>
  </div>
</header>