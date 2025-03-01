<div class="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <div class="border-0 shadow-none">
    <div class="w-full">
      <div class="px-6 pt-6">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">Welcome to ArtiSell</h1>
        <div class="grid w-full grid-cols-2 mb-6">
          <a href="index.php?tab=login" class="py-2 text-center <?php echo ($auth_tab == 'login') ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'; ?>">Login</a>
          <a href="index.php?tab=register" class="py-2 text-center <?php echo ($auth_tab == 'register') ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'; ?>">Register</a>
        </div>
      </div>

      <div class="p-0">
        <?php if ($auth_tab == 'login'): ?>
          <?php include 'login_form.php'; ?>
        <?php else: ?>
          <?php include 'register_form.php'; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>