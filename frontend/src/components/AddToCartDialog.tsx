import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product, CartItem } from '../backend';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';

interface AddToCartDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function AddToCartDialog({ product, open, onClose }: AddToCartDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;

    const cartItem: CartItem = {
      productId: product.id,
      size: selectedSize,
      quantity: BigInt(quantity),
    };

    try {
      await addToCart.mutateAsync(cartItem);
      toast.success(`Added ${product.name} to cart!`);
      onClose();
      setSelectedSize('');
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Add to cart error:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedSize('');
    setQuantity(1);
  };

  if (!product) return null;

  const price = Number(product.price) / 100;
  const isInStock = Number(product.inventory) > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add to Cart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <img
              src={product.imagePath}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-2xl font-bold text-primary">${price.toFixed(2)}</p>
              {!isInStock && (
                <Badge variant="destructive" className="mt-1">Out of Stock</Badge>
              )}
            </div>
          </div>

          {isInStock && (
            <>
              {/* Size Selection */}
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || addToCart.isPending}
                className="w-full gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
