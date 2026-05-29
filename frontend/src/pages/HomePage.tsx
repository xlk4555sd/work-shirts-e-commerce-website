import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Crafted from the finest materials for lasting comfort and durability.'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50. Get your shirts delivered quickly.'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Not satisfied? Return within 30 days for a full refund.'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: 'Hassle-free returns and exchanges to ensure the perfect fit.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  Professional Workwear
                </Badge>
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
                  Work Shirts That Work
                  <span className="text-primary"> As Hard</span> As You Do
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Discover our collection of premium work shirts designed for comfort, 
                  durability, and professional style. Perfect for any workplace.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="gap-2 shadow-soft">
                    Shop Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  View Size Guide
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="/assets/generated/hero-banner-professionals.jpg"
                alt="Professional wearing work shirt"
                className="w-full h-auto rounded-2xl shadow-soft-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Why Choose Our Work Shirts?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best work shirts that combine comfort, 
            style, and durability for professionals like you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-soft transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="bg-muted/30">
        <div className="container py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Featured Work Shirts
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our most popular styles loved by professionals everywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="overflow-hidden group hover:shadow-soft-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src="/assets/generated/navy-work-shirt-model.jpg"
                  alt="Navy Work Shirt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Classic Navy</h3>
                <p className="text-muted-foreground mb-4">
                  Timeless navy blue work shirt perfect for any professional setting.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$49.99</span>
                  <Badge variant="outline">Best Seller</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-soft-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src="/assets/generated/white-work-shirt-folded.jpg"
                  alt="White Work Shirt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Crisp White</h3>
                <p className="text-muted-foreground mb-4">
                  Clean, professional white shirt that's perfect for formal occasions.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$44.99</span>
                  <Badge variant="outline">Classic</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-soft-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src="/assets/generated/gray-work-shirt-flat.jpg"
                  alt="Gray Work Shirt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Modern Gray</h3>
                <p className="text-muted-foreground mb-4">
                  Contemporary gray shirt that offers versatility and style.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$47.99</span>
                  <Badge variant="outline">New</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="gap-2">
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Ready to Upgrade Your Work Wardrobe?
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of professionals who trust our work shirts for their daily needs. 
              Experience the perfect blend of comfort and professionalism.
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Shopping
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
