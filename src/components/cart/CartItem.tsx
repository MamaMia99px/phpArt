import React from "react";
import { Button } from "../ui/button";
import { Trash, Plus, Minus } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) => {
  const handleIncreaseQuantity = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000"
          }
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="truncate max-w-[200px]">{name}</h3>
            <p className="ml-4">₱{(price * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">₱{price.toFixed(2)} each</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-gray-500 w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800"
            onClick={() => onRemove(id)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
