import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AddProduct = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    subcategory: "",
    stock_quantity: "10",
  });

  const categories = [
    "Arts",
    "Crafts",
    "Food",
    "Clothing",
    "Accessories",
    "Home Decor",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate form
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.category
      ) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields",
        });
        return;
      }

      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be logged in to add products",
        });
        return;
      }

      // Create product
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url:
            formData.image_url ||
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000",
          category: formData.category,
          subcategory: formData.subcategory,
          stock_quantity: parseInt(formData.stock_quantity),
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Product added successfully",
        description: `${formData.name} has been added to your products.`,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category: "",
        subcategory: "",
        stock_quantity: "10",
      });
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: error.message || "There was an error adding your product.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>
              Add your Cebuano artisan product to the marketplace
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Handcrafted Bamboo Basket"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₱) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="299.99"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="Optional subcategory"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500">
              Leave blank to use a default image
            </p>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  image_url: "",
                  category: "",
                  subcategory: "",
                  stock_quantity: "10",
                })
              }
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProduct;
