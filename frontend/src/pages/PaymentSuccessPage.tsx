import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-heading">Payment Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg">Thank you for your order!</p>
              <p className="text-muted-foreground">
                Your payment has been processed successfully. You will receive an email confirmation 
                shortly with your order details and tracking information.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>What's next?</strong><br />
                • You'll receive an order confirmation email<br />
                • Your items will be prepared for shipping<br />
                • You'll get tracking information once shipped
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              
              <Link to="/products">
                <Button className="gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
