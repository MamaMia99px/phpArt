import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Package,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect happens automatically due to auth state change
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>
                    {user?.user_metadata?.full_name || "User"}
                  </CardTitle>
                  <CardDescription className="text-xs truncate max-w-[200px]">
                    {user?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/add-product")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/products")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Cart
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to ArtiSell</CardTitle>
              <CardDescription>
                Your dashboard for managing your Cebuano artisan marketplace
                experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/products")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Browse Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Explore authentic Cebuano arts, crafts, and traditional
                      foods.
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/cart")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Your Cart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View your shopping cart and proceed to checkout.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
