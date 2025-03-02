import React from "react";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";

interface AuthHeaderProps {
  onLogoClick?: () => void;
  onShopClick?: () => void;
}

const AuthHeader = ({
  onLogoClick = () => {},
  onShopClick = () => {},
}: AuthHeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8 lg:px-12">
      <div className="flex items-center">
        <button
          onClick={onLogoClick}
          className="flex items-center focus:outline-none"
        >
          <img src="/vite.svg" alt="ArtiSell Logo" className="h-10 w-10 mr-2" />
          <span className="text-xl font-bold text-blue-600">ArtiSell</span>
        </button>
        <div className="hidden md:flex ml-8 space-x-6">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Products
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShopClick}
          className="relative"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            0
          </span>
        </Button>

        {/* Theme Toggle */}
        {/* Import and use ThemeToggle component */}

        <div className="hidden md:block">
          <Button variant="outline" className="mr-2">
            Sign In
          </Button>
          <Button>Register</Button>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
