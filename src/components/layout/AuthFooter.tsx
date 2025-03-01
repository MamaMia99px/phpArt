import React from "react";
import { Separator } from "../ui/separator";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface AuthFooterProps {
  companyName?: string;
  year?: number;
}

const AuthFooter = ({
  companyName = "ArtiSell",
  year = new Date().getFullYear(),
}: AuthFooterProps) => {
  return (
    <footer className="w-full py-4 px-6 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          &copy; {year} {companyName}. All rights reserved.
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Instagram size={18} />
            </a>
          </div>

          <Separator orientation="vertical" className="h-4 hidden md:block" />

          <div className="flex space-x-4 text-xs">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;
