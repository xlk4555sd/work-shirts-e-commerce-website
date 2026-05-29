import React, { useState } from 'react';
import { useGetProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProductCard from '../components/ProductCard';
import AddToCartDialog from '../components/AddToCartDialog';
import UserProfileSetup from '../components/UserProfileSetup';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Product } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ProductsPage() {
  const { data: products, isLoading, error } = useGetProducts();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddToCart, setShowAddToCart] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      // Could show login prompt here
      return;
    }
    setSelectedProduct(product);
    setShowAddToCart(true);
  };

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            Our Work Shirt Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of professional work shirts designed for comfort, 
            durability, and style in any workplace environment.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No products available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>

      {/* Add to Cart Dialog */}
      <AddToCartDialog
        product={selectedProduct}
        open={showAddToCart}
        onClose={() => {
          setShowAddToCart(false);
          setSelectedProduct(null);
        }}
      />

      {/* User Profile Setup */}
      <UserProfileSetup
        open={showProfileSetup}
        onClose={() => {}}
      />
    </div>
  );
}
