import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AddToCartDialog from '../components/AddToCartDialog';
import UserProfileSetup from '../components/UserProfileSetup';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: product, isLoading, error } = useGetProduct(productId);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showAddToCart, setShowAddToCart] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAddToCart = () => {
    if (!isAuthenticated || !product) return;
    setShowAddToCart(true);
  };

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load product details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Product not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const price = Number(product.price) / 100;
  const isInStock = Number(product.inventory) > 0;

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Back Button */}
        <Link to="/products">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-heading font-bold">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  ${price.toFixed(2)}
                </span>
                {!isInStock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Available Sizes */}
            <div className="space-y-3">
              <h3 className="font-semibold">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="px-3 py-1">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Available Colors */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline" className="px-3 py-1">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isInStock 
                  ? `${Number(product.inventory)} items in stock`
                  : 'Currently out of stock'
                }
              </p>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock || !isAuthenticated}
              size="lg"
              className="w-full gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {!isAuthenticated 
                ? 'Login to Add to Cart'
                : isInStock 
                  ? 'Add to Cart' 
                  : 'Out of Stock'
              }
            </Button>

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
                Please log in to add items to your cart
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <AddToCartDialog
        product={product}
        open={showAddToCart}
        onClose={() => setShowAddToCart(false)}
      />

      {/* User Profile Setup */}
      <UserProfileSetup
        open={showProfileSetup}
        onClose={() => {}}
      />
    </div>
  );
}
