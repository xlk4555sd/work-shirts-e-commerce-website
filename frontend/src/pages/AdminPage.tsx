import React, { useState } from 'react';
import { useIsCallerAdmin, useIsStripeConfigured, useSetStripeConfiguration, useAddProduct } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { StripeConfiguration, Product } from '../backend';
import { toast } from 'sonner';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: isStripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const addProduct = useAddProduct();

  const [stripeForm, setStripeForm] = useState({
    secretKey: '',
    allowedCountries: 'US,CA,GB,AU',
  });

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    imagePath: '',
    sizes: 'S,M,L,XL,XXL',
    colors: 'Navy,White,Gray,Black',
    inventory: '',
  });

  const isAuthenticated = !!identity;
  const isLoading = adminLoading || stripeLoading;

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeForm.secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const config: StripeConfiguration = {
      secretKey: stripeForm.secretKey.trim(),
      allowedCountries: stripeForm.allowedCountries.split(',').map(c => c.trim()),
    };

    try {
      await setStripeConfig.mutateAsync(config);
      toast.success('Stripe configuration saved successfully');
      setStripeForm({ secretKey: '', allowedCountries: 'US,CA,GB,AU' });
    } catch (error) {
      toast.error('Failed to save Stripe configuration');
      console.error('Stripe config error:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.id.trim() || !productForm.name.trim() || !productForm.price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: productForm.id.trim(),
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: BigInt(Math.round(parseFloat(productForm.price) * 100)), // Convert to cents
      imagePath: productForm.imagePath.trim(),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(s => s),
      colors: productForm.colors.split(',').map(c => c.trim()).filter(c => c),
      inventory: BigInt(parseInt(productForm.inventory) || 0),
    };

    try {
      await addProduct.mutateAsync(product);
      toast.success('Product added successfully');
      setProductForm({
        id: '',
        name: '',
        description: '',
        price: '',
        imagePath: '',
        sizes: 'S,M,L,XL,XXL',
        colors: 'Navy,White,Gray,Black',
        inventory: '',
      });
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Add product error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have admin privileges to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
        </div>

        <Tabs defaultValue="stripe" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Stripe Setup
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
          </TabsList>

          {/* Stripe Configuration */}
          <TabsContent value="stripe">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe Configuration
                  </CardTitle>
                  {isStripeConfigured && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Configured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isStripeConfigured ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Stripe is already configured and ready to process payments.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleStripeSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secretKey">Stripe Secret Key *</Label>
                      <Input
                        id="secretKey"
                        type="password"
                        value={stripeForm.secretKey}
                        onChange={(e) => setStripeForm(prev => ({ ...prev, secretKey: e.target.value }))}
                        placeholder="sk_test_..."
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Your Stripe secret key (starts with sk_test_ or sk_live_)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="countries">Allowed Countries</Label>
                      <Input
                        id="countries"
                        value={stripeForm.allowedCountries}
                        onChange={(e) => setStripeForm(prev => ({ ...prev, allowedCountries: e.target.value }))}
                        placeholder="US,CA,GB,AU"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of country codes (e.g., US,CA,GB,AU)
                      </p>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={setStripeConfig.isPending}
                      className="w-full"
                    >
                      {setStripeConfig.isPending ? 'Saving...' : 'Save Stripe Configuration'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">Product ID *</Label>
                      <Input
                        id="productId"
                        value={productForm.id}
                        onChange={(e) => setProductForm(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="navy-work-shirt"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Navy Work Shirt"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Professional navy work shirt perfect for any workplace..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="49.99"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="inventory">Inventory Count</Label>
                      <Input
                        id="inventory"
                        type="number"
                        min="0"
                        value={productForm.inventory}
                        onChange={(e) => setProductForm(prev => ({ ...prev, inventory: e.target.value }))}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagePath">Image Path</Label>
                    <Input
                      id="imagePath"
                      value={productForm.imagePath}
                      onChange={(e) => setProductForm(prev => ({ ...prev, imagePath: e.target.value }))}
                      placeholder="/assets/generated/navy-work-shirt-model.jpg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sizes">Available Sizes</Label>
                      <Input
                        id="sizes"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm(prev => ({ ...prev, sizes: e.target.value }))}
                        placeholder="S,M,L,XL,XXL"
                      />
                      <p className="text-xs text-muted-foreground">Comma-separated</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="colors">Available Colors</Label>
                      <Input
                        id="colors"
                        value={productForm.colors}
                        onChange={(e) => setProductForm(prev => ({ ...prev, colors: e.target.value }))}
                        placeholder="Navy,White,Gray,Black"
                      />
                      <p className="text-xs text-muted-foreground">Comma-separated</p>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={addProduct.isPending}
                    className="w-full"
                  >
                    {addProduct.isPending ? 'Adding Product...' : 'Add Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
