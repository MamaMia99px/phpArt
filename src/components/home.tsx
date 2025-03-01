import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "./layout/AuthHeader";
import AuthForms from "./auth/AuthForms";
import AuthFooter from "./layout/AuthFooter";

interface HomeProps {
  defaultAuthTab?: "login" | "register";
}

const Home = ({ defaultAuthTab = "login" }: HomeProps) => {
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState<"login" | "register">(defaultAuthTab);

  // Mock handlers for authentication actions
  const handleLoginSubmit = (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    console.log("Login submitted:", data);
    // In a real app, you would handle authentication here
    // and redirect to the dashboard or home page
  };

  const handleRegisterSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("Registration submitted:", data);
    // In a real app, you would handle user registration here
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // In a real app, you would navigate to a password reset page
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // In a real app, you would initiate OAuth flow with the selected provider
  };

  const handleLogoClick = () => {
    console.log("Logo clicked");
    // Navigate to home or refresh the page
  };

  const handleShopClick = () => {
    console.log("Shop icon clicked");
    // Navigate to shopping cart
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AuthHeader onLogoClick={handleLogoClick} onShopClick={handleShopClick} />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-blue-600">ArtiSell</h1>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Cebu Artisan Marketplace
                </h2>
                <p className="text-gray-600">
                  Discover authentic Cebuano arts, crafts, and traditional foods
                  from local artisans. Join our community to showcase your
                  creations or find unique handcrafted items.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-blue-500 font-medium mb-2">
                      Handcrafted Arts
                    </div>
                    <p className="text-sm text-gray-500">
                      Unique paintings, sculptures, and visual arts from Cebu's
                      finest artists
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-blue-500 font-medium mb-2">
                      Traditional Crafts
                    </div>
                    <p className="text-sm text-gray-500">
                      Baskets, shellwork, and other traditional Cebuano
                      craftsmanship
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-blue-500 font-medium mb-2">
                      Local Delicacies
                    </div>
                    <p className="text-sm text-gray-500">
                      Authentic Cebuano food products and traditional delicacies
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-blue-500 font-medium mb-2">
                      Artisan Community
                    </div>
                    <p className="text-sm text-gray-500">
                      Connect with local artisans and support Cebuano culture
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <AuthForms
                defaultTab={authTab}
                onLoginSubmit={handleLoginSubmit}
                onRegisterSubmit={handleRegisterSubmit}
                onForgotPassword={handleForgotPassword}
                onSocialLogin={handleSocialLogin}
              />
            </div>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default Home;
