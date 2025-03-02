import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CartItem from "./CartItem";
import { ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Get cart ID
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (cartError) throw cartError;
      setCartId(cartData.id);

      // Get cart items with product details
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "id, product_id, quantity, product:products(id, name, price, image_url)",
        )
        .eq("cart_id", cartData.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      // Update local state
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;

      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Shopping Cart
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding some amazing Cebuano artisan products!
            </p>
            <div className="mt-6">
              <Button onClick={() => (window.location.href = "/")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-2">
                  <CartItem
                    id={item.id}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    imageUrl={item.product.image_url}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      {cartItems.length > 0 && (
        <CardFooter className="border-t border-gray-200 pt-6">
          <div className="w-full">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>₱{calculateTotal().toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
            <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Button
                  variant="link"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => (window.location.href = "/")}
                >
                  Continue Shopping
                </Button>
              </p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingCart;
