import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart, cartCount } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart after successful payment
    if (sessionId) {
      clearCart().catch(console.error);
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
                  <p className="text-muted-foreground">
                    Thank you for your purchase. Your order has been confirmed and is being processed.
                  </p>
                </div>
                
                {sessionId && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    Order ID: {sessionId.slice(0, 20)}...
                  </div>
                )}
                
                <div className="space-y-3 pt-4">
                  <Link to="/dashboard" className="block">
                    <Button className="w-full">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View My Orders
                    </Button>
                  </Link>
                  
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;