<?php
// Process registration form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register_submit'])) {
    $name = sanitize_input($_POST['name']);
    $email = sanitize_input($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate input
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    } elseif (email_exists($email)) {
        $errors[] = "Email already exists. Please use a different email or login.";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    } elseif (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long";
    }
    
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // If no errors, register the user
    if (empty($errors)) {
        if (register_user($name, $email, $password)) {
            // Auto login after registration
            login_user($email, $password);
            
            // Redirect to dashboard
            header("Location: dashboard.php");
            exit();
        } else {
            $errors[] = "Registration failed. Please try again.";
        }
    }
}
?>

<div class="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
  <form method="POST" action="" class="space-y-4">
    <?php if (isset($errors) && !empty($errors)): ?>
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <ul class="list-disc pl-5">
          <?php foreach ($errors as $error): ?>
            <li><?php echo $error; ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>
    
    <div class="space-y-2">
      <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="John Doe"
        value="<?php echo isset($_POST['name']) ? $_POST['name'] : ''; ?>"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="space-y-2">
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="john.doe@example.com"
        value="<?php echo isset($_POST['email']) ? $_POST['email'] : ''; ?>"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="space-y-2">
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <div class="relative">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        <button
          type="button"
          onclick="togglePasswordVisibility('password')"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <svg id="password-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
      <div class="relative">
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="••••••••"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
        />
        <button
          type="button"
          onclick="togglePasswordVisibility('confirm_password')"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <svg id="confirm-password-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>

    <button
      type="submit"
      name="register_submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Create Account
    </button>

    <div class="flex items-center my-4">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="px-3 text-sm text-gray-500">or continue with</span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <a
        href="social_login.php?provider=facebook"
        class="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2 text-blue-600">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
        <span class="sr-only sm:not-sr-only sm:text-xs">Facebook</span>
      </a>
      <a
        href="social_login.php?provider=github"
        class="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        <span class="sr-only sm:not-sr-only sm:text-xs">GitHub</span>
      </a>
      <a
        href="social_login.php?provider=google"
        class="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2 text-red-500">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M3 8l9 6 9-6"></path>
        </svg>
        <span class="sr-only sm:not-sr-only sm:text-xs">Google</span>
      </a>
    </div>

    <div class="text-center mt-4">
      <p class="text-sm text-gray-600">
        Already have an account?
        <a href="index.php?tab=login" class="text-blue-600 hover:underline font-medium">Sign in</a>
      </p>
    </div>
  </form>
</div>