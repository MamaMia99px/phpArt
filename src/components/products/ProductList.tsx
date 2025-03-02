import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductGrid from "./ProductGrid";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) throw error;

      if (data) {
        setProducts(data);
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      // Get user's cart
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        // Handle not logged in
        console.log("User not logged in");
        return;
      }

      // Get cart ID
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (cartError) throw cartError;

      // Check if item already in cart
      const { data: existingItem, error: existingItemError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartData.id)
        .eq("product_id", productId)
        .single();

      if (existingItemError && existingItemError.code !== "PGRST116") {
        throw existingItemError;
      }

      if (existingItem) {
        // Update quantity
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from("cart_items")
          .insert({
            cart_id: cartData.id,
            product_id: productId,
            quantity: 1,
          });

        if (insertError) throw insertError;
      }

      console.log("Product added to cart");
      // You could show a toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleViewDetails = (productId: string) => {
    console.log("View details for product:", productId);
    // Navigate to product details page
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cebuano Artisan Products</h2>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default ProductList;
