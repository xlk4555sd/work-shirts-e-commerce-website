import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetCart, useUpdateCart, useClearCart, useGetProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { CartItem } from '../backend';
import { toast } from 'sonner';

export default function CartPage() {
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { identity } = useInternetIdentity();
  const updateCart = useUpdateCart();
  const clearCart = useClearCart();

  const isAuthenticated = !!identity;
  const isLoading = cartLoading || productsLoading;

  const updateQuantity = async (productId: string, size: string, newQuantity: number) => {
    if (!cart || newQuantity < 1) return;

    const updatedItems = cart.items.map(item => 
      item.productId === productId && item.size === size
        ? { ...item, quantity: BigInt(newQuantity) }
        : item
    );

    try {
      await updateCart.mutateAsync(updatedItems);
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Update cart error:', error);
    }
  };

  const removeItem = async (productId: string, size: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(
      item => !(item.productId === productId && item.size === size)
    );

    try {
      await updateCart.mutateAsync(updatedItems);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Remove item error:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-heading font-bold">Your Cart</h1>
          <p className="text-lg text-muted-foreground">
            Please log in to view your cart and continue shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="outline" className="gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-20" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-heading font-bold">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground">
            Looks like you haven't added any work shirts to your cart yet. 
            Explore our collection to find the perfect shirts for your needs.
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = cart.items.map(item => {
    const product = products?.find(p => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = Number(cart.total) / 100;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold">Your Cart</h1>
          {cart.items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={clearCart.isPending}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              if (!item.product) {
                return (
                  <Alert key={index} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Product not found for item in cart.
                    </AlertDescription>
                  </Alert>
                );
              }

              const price = Number(item.product.price) / 100;
              const quantity = Number(item.quantity);
              const itemTotal = price * quantity;

              return (
                <Card key={`${item.productId}-${item.size}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.imagePath}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Size: {item.size}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId, item.size)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.size, quantity - 1)}
                              disabled={quantity <= 1 || updateCart.isPending}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.size, quantity + 1)}
                              disabled={updateCart.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">${price.toFixed(2)} each</p>
                            <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="secondary" className="text-xs">Free</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {subtotal < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Link to="/checkout">
                  <Button size="lg" className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
