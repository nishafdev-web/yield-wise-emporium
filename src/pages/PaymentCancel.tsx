import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancel = () => {
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
                  <p className="text-muted-foreground">
                    Your payment was cancelled. Don't worry, your cart has been saved and you can try again anytime.
                  </p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Link to="/cart" className="block">
                    <Button className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Return to Cart
                    </Button>
                  </Link>
                  
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
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

export default PaymentCancel;