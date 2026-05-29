import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/generated/workshirts-logo.png" 
                alt="WorkShirts" 
                className="h-6 w-auto"
              />
              <span className="font-heading text-xl font-bold text-primary">
                WorkShirts
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Quality work shirts for professionals who value comfort and style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
              <li><a href="/cart" className="text-muted-foreground hover:text-primary transition-colors">Cart</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Size Guide</span></li>
              <li><span className="text-muted-foreground">Returns</span></li>
              <li><span className="text-muted-foreground">Shipping Info</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">support@workshirts.com</span></li>
              <li><span className="text-muted-foreground">1-800-WORKSHIRT</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2025. Built with <Heart className="h-4 w-4 text-red-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
