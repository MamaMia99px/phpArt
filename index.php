<?php
  session_start();
  require_once 'includes/db_connection.php';
  require_once 'includes/functions.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ArtiSell - Cebu Artisan Marketplace</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-50">
  <div id="root">
    <?php include 'includes/header.php'; ?>

    <main class="flex-grow flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="hidden md:block">
            <div class="space-y-6">
              <h1 class="text-4xl font-bold text-blue-600">ArtiSell</h1>
              <h2 class="text-2xl font-semibold text-gray-800">
                Cebu Artisan Marketplace
              </h2>
              <p class="text-gray-600">
                Discover authentic Cebuano arts, crafts, and traditional foods
                from local artisans. Join our community to showcase your
                creations or find unique handcrafted items.
              </p>
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div class="text-blue-500 font-medium mb-2">
                    Handcrafted Arts
                  </div>
                  <p class="text-sm text-gray-500">
                    Unique paintings, sculptures, and visual arts from Cebu's
                    finest artists
                  </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div class="text-blue-500 font-medium mb-2">
                    Traditional Crafts
                  </div>
                  <p class="text-sm text-gray-500">
                    Baskets, shellwork, and other traditional Cebuano
                    craftsmanship
                  </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div class="text-blue-500 font-medium mb-2">
                    Local Delicacies
                  </div>
                  <p class="text-sm text-gray-500">
                    Authentic Cebuano food products and traditional delicacies
                  </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div class="text-blue-500 font-medium mb-2">
                    Artisan Community
                  </div>
                  <p class="text-sm text-gray-500">
                    Connect with local artisans and support Cebuano culture
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <?php
              $auth_tab = isset($_GET['tab']) ? $_GET['tab'] : 'login';
              include 'includes/auth_forms.php';
            ?>
          </div>
        </div>
      </div>
    </main>

    <?php include 'includes/footer.php'; ?>
  </div>
  
  <script src="js/main.js"></script>
</body>
</html>