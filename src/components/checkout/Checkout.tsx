import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { CreditCard, Truck, MapPin, CheckCircle } from "lucide-react";

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

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "Cebu City",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
    notes: "",
  });

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

      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, address, phone")
        .eq("id", userData.user.id)
        .single();

      if (!profileError && profileData) {
        setFormData((prev) => ({
          ...prev,
          fullName: profileData.full_name || "",
          address: profileData.address || "",
          phone: profileData.phone || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  };

  const calculateShipping = () => {
    // Simple shipping calculation
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 100; // Free shipping for orders over ₱1000
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Validate form
      if (!formData.fullName || !formData.address || !formData.phone) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields",
        });
        setLoading(false);
        return;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userData.user.id,
          status: "pending",
          total_amount: calculateTotal(),
          shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          payment_method: formData.paymentMethod,
          payment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

      if (clearCartError) throw clearCartError;

      // Update user profile if needed
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          address: formData.address,
          phone: formData.phone,
        })
        .eq("id", userData.user.id);

      if (profileError) throw profileError;

      setOrderId(orderData.id);
      setOrderPlaced(true);
      toast({
        title: "Order placed successfully",
        description: `Your order #${orderData.id.substring(0, 8)} has been placed.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description:
          "There was an error processing your order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-6 w-6" />
            Order Confirmed
          </CardTitle>
          <CardDescription>
            Thank you for your purchase from ArtiSell!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Your order has been placed successfully
            </h3>
            <p className="text-green-700">
              Order ID: {orderId?.substring(0, 8)}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === 0
                    ? "Free"
                    : `₱${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>₱{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
            <Button onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Button variant="outline" onClick={() => navigate("/cart")}>
          Back to Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping and Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                    GCash
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Special instructions for delivery"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-start">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-2">
                          <img
                            src={
                              item.product.image_url ||
                              "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000"
                            }
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x ₱{item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        ₱{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₱{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Shipping
                      </span>
                      <span>
                        {calculateShipping() === 0
                          ? "Free"
                          : `₱${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-base">
                      <span>Total</span>
                      <span>₱{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button
                className="w-full"
                disabled={cartItems.length === 0 || loading}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
