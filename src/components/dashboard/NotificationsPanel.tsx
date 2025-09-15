import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, Package, ShoppingCart, User, Trash2, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'order_created' | 'order_updated' | 'profile_updated' | 'cart_updated';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const NotificationsPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Load initial notifications (simulated for demo)
    const loadNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order_created',
          title: 'New Order Created',
          message: 'Your order #12345 has been successfully created and is being processed.',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: '2',
          type: 'profile_updated',
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: '3',
          type: 'order_updated',
          title: 'Order Status Update',
          message: 'Your order #12344 has been shipped and is on its way.',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
        {
          id: '4',
          type: 'cart_updated',
          title: 'Cart Item Added',
          message: 'New item "Organic Fertilizer 5kg" has been added to your cart.',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    };

    loadNotifications();

    // Set up real-time listeners for database changes
    const ordersChannel = supabase
      .channel('notifications-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Orders change received:', payload);
          
          let title = '';
          let message = '';
          
          if (payload.eventType === 'INSERT') {
            title = 'New Order Created';
            message = `Your order has been successfully created and is being processed.`;
          } else if (payload.eventType === 'UPDATE') {
            title = 'Order Status Update';
            message = `Your order status has been updated to: ${payload.new?.status || 'updated'}.`;
          }

          if (title && message && payload.new && typeof payload.new === 'object') {
            const orderId = (payload.new as any).id || Date.now();
            const newNotification: Notification = {
              id: `order-${orderId}`,
              type: payload.eventType === 'INSERT' ? 'order_created' : 'order_updated',
              title,
              message,
              read: false,
              created_at: new Date().toISOString(),
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title,
              description: message,
            });
          }
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('notifications-profiles')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile change received:', payload);
          
          const newNotification: Notification = {
            id: `profile-${Date.now()}`,
            type: 'profile_updated',
            title: 'Profile Updated',
            message: 'Your profile information has been successfully updated.',
            read: false,
            created_at: new Date().toISOString(),
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: 'Profile Updated',
            description: 'Your profile information has been successfully updated.',
          });
        }
      )
      .subscribe();

    const cartChannel = supabase
      .channel('notifications-cart')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Cart change received:', payload);
          
          let title = '';
          let message = '';
          
          if (payload.eventType === 'INSERT') {
            title = 'Cart Item Added';
            message = 'A new item has been added to your cart.';
          } else if (payload.eventType === 'UPDATE') {
            title = 'Cart Item Updated';
            message = 'A cart item has been updated.';
          } else if (payload.eventType === 'DELETE') {
            title = 'Cart Item Removed';
            message = 'An item has been removed from your cart.';
          }

          if (title && message) {
            const newNotification: Notification = {
              id: `cart-${Date.now()}`,
              type: 'cart_updated',
              title,
              message,
              read: false,
              created_at: new Date().toISOString(),
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title,
              description: message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(cartChannel);
    };
  }, [user]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_created':
      case 'order_updated':
        return <Package className="h-4 w-4" />;
      case 'cart_updated':
        return <ShoppingCart className="h-4 w-4" />;
      case 'profile_updated':
        return <User className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay updated with your account activity
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      notification.read 
                        ? 'bg-muted/50 opacity-75' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className={`mt-1 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;