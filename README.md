# ArtiSell - Cebu Artisan Marketplace

A PHP-based eCommerce platform showcasing authentic Cebuano arts, crafts, and traditional foods with seamless browsing and purchasing functionality.

## Features

- User authentication system with login/registration
- Product catalog with categories for arts, crafts, and traditional foods
- Shopping cart and checkout system
- User profile dashboard
- Responsive design for mobile and desktop

## Installation

1. Clone this repository to your XAMPP htdocs folder or your web server's document root
2. Make sure you have PHP and MySQL installed (XAMPP recommended)
3. Start your Apache and MySQL services
4. Navigate to http://localhost/phpmyadmin and create a new database named `artisell_db`
5. Alternatively, visit http://localhost/artisell/setup_database.php to automatically set up the database
6. Access the application at http://localhost/artisell

## Database Setup

The application uses MySQL database. You can set up the database by visiting the setup_database.php file in your browser, or by importing the SQL file manually.

## Technologies Used

- PHP
- MySQL
- HTML/CSS
- Tailwind CSS
- JavaScript

## Project Structure

- `index.php` - Main entry point and homepage
- `includes/` - Contains reusable PHP components and functions
  - `db_connection.php` - Database connection setup
  - `functions.php` - Helper functions
  - `header.php` - Site header
  - `footer.php` - Site footer
  - `auth_forms.php` - Authentication forms container
  - `login_form.php` - Login form
  - `register_form.php` - Registration form
- `css/` - Stylesheets
- `js/` - JavaScript files
- `dashboard.php` - User dashboard
- `logout.php` - Logout functionality
- `setup_database.php` - Database setup script

## License

This project is licensed under the MIT License.
