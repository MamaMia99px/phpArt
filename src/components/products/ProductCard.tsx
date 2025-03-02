import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  onAddToCart?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  onAddToCart = () => {},
  onViewDetails = () => {},
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative pb-[56.25%] overflow-hidden bg-gray-100">
        <img
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000"
          }
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        <p className="text-lg font-bold mt-2 text-blue-600">
          ₱{price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails(id)}
        >
          View Details
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => onAddToCart(id)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
