<?php
session_start();
require_once 'includes/functions.php';

// Log the user out
logout_user();

// Redirect to the home page
header("Location: index.php");
exit();
?>