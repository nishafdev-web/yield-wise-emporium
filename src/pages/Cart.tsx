import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, Package, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, cartCount, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart Empty",
        description: "Please add items to your cart before checkout",
      });
      return;
    }

    try {
      setProcessing(true);
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { cartItems }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.message || "Something went wrong during checkout",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">{cartCount} items in your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Cart is Empty</h3>
                <p className="text-muted-foreground mb-6">Add some items to your cart to get started.</p>
                <Link to="/">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.products?.image_url ? (
                            <img 
                              src={item.products.image_url} 
                              alt={item.products.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.products?.name || 'Product'}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${item.products?.price || 0} each
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.products?.stock || 0} available
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value) || 1;
                              if (newQty !== item.quantity) {
                                updateQuantity(item.id, newQty);
                              }
                            }}
                            className="w-16 text-center"
                            min="1"
                            max={item.products?.stock || 999}
                            disabled={updating === item.id}
                          />
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={
                              item.quantity >= (item.products?.stock || 0) || 
                              updating === item.id
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-0">
                          <p className="font-semibold">
                            ${((item.products?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            disabled={updating === item.id}
                            className="text-destructive hover:text-destructive p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Items ({cartCount})</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={processing || cartItems.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {processing ? "Processing..." : "Proceed to Checkout"}
                    </Button>
                    
                    <Link to="/" className="block">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;