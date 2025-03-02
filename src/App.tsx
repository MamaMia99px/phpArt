import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard/Dashboard";
import ProductList from "./components/products/ProductList";
import ShoppingCart from "./components/cart/ShoppingCart";
import Checkout from "./components/checkout/Checkout";
import AddProduct from "./components/products/AddProduct";
import SettingsPage from "./components/settings/SettingsPage";
import { useAuth } from "./components/auth/AuthProvider";
import routes from "tempo-routes";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/products"
            element={user ? <ProductList /> : <Navigate to="/" />}
          />
          <Route
            path="/cart"
            element={user ? <ShoppingCart /> : <Navigate to="/" />}
          />
          <Route
            path="/checkout"
            element={user ? <Checkout /> : <Navigate to="/" />}
          />
          <Route
            path="/add-product"
            element={user ? <AddProduct /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/" />}
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
