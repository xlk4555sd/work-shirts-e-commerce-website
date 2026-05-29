import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const price = Number(product.price) / 100; // Convert cents to dollars
  const isInStock = Number(product.inventory) > 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
      <Link to="/product/$productId" params={{ productId: product.id }}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imagePath}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          {!isInStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes.slice(0, 4).map((size) => (
            <Badge key={size} variant="outline" className="text-xs">
              {size}
            </Badge>
          ))}
          {product.sizes.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{product.sizes.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart?.(product)}
          disabled={!isInStock}
          className="w-full gap-2"
          variant={isInStock ? "default" : "secondary"}
        >
          <ShoppingCart className="h-4 w-4" />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
