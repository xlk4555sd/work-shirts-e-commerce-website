import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-heading">Payment Failed</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg">We couldn't process your payment</p>
              <p className="text-muted-foreground">
                Your payment was not completed. This could be due to insufficient funds, 
                an expired card, or a temporary issue with your payment method.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>What you can do:</strong><br />
                • Check your payment information and try again<br />
                • Try a different payment method<br />
                • Contact your bank if the issue persists<br />
                • Reach out to our support team for assistance
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cart">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cart
                </Button>
              </Link>
              
              <Link to="/checkout">
                <Button className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{' '}
                <a href="mailto:support@workshirts.com" className="text-primary hover:underline">
                  support@workshirts.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
