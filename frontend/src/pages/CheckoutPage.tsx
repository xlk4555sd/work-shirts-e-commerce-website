import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetProducts, usePlaceOrder, useCreateCheckoutSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Order, ShoppingItem } from '../backend';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { identity } = useInternetIdentity();
  const placeOrder = usePlaceOrder();
  const createCheckoutSession = useCreateCheckoutSession();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    shippingAddress: '',
  });

  const isAuthenticated = !!identity;
  const isLoading = cartLoading || productsLoading;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || !products || !isAuthenticated) return;

    // Validate form
    if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.shippingAddress.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create shopping items for Stripe
      const shoppingItems: ShoppingItem[] = cart.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error('Product not found');
        
        return {
          productName: `${product.name} (Size: ${item.size})`,
          productDescription: product.description,
          priceInCents: product.price,
          quantity: item.quantity,
          currency: 'usd',
        };
      });

      // Create Stripe checkout session
      const session = await createCheckoutSession.mutateAsync(shoppingItems);
      
      // Create order record
      const order: Order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerName: customerInfo.name.trim(),
        email: customerInfo.email.trim(),
        shippingAddress: customerInfo.shippingAddress.trim(),
        items: cart.items,
        total: cart.total,
        status: 'pending',
        timestamp: BigInt(Date.now()),
      };

      await placeOrder.mutateAsync(order);
      
      // Redirect to Stripe checkout
      window.location.href = session.url;
      
    } catch (error) {
      toast.error('Failed to process checkout');
      console.error('Checkout error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-heading font-bold">Checkout</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to proceed with checkout.
            </AlertDescription>
          </Alert>
          <Link to="/cart">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-heading font-bold">Checkout</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your cart is empty. Add some items before proceeding to checkout.
            </AlertDescription>
          </Alert>
          <Link to="/products">
            <Button className="gap-2">
              Continue Shopping
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
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.shippingAddress}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                    placeholder="Enter your complete shipping address"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => {
                    if (!item.product) return null;
                    
                    const price = Number(item.product.price) / 100;
                    const quantity = Number(item.quantity);
                    const itemTotal = price * quantity;

                    return (
                      <div key={`${item.productId}-${item.size}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Size: {item.size}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Qty: {quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold">${itemTotal.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
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
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={placeOrder.isPending || createCheckoutSession.isPending}
                >
                  <CreditCard className="h-4 w-4" />
                  {placeOrder.isPending || createCheckoutSession.isPending 
                    ? 'Processing...' 
                    : 'Proceed to Payment'
                  }
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to our secure payment processor to complete your purchase.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
