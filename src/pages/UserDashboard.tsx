import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileManagement from '@/components/dashboard/ProfileManagement';
import OrderHistory from '@/components/dashboard/OrderHistory';
import CartManagement from '@/components/dashboard/CartManagement';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import { User, Package, ShoppingCart, Settings, Bell, BarChart3, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement />;
      case 'orders':
        return <OrderHistory />;
      case 'cart':
        return <CartManagement />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cart Items
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Items ready for checkout
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Spent
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹2,450</div>
                  <p className="text-xs text-muted-foreground">
                    +₹180 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Status
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Account in good standing
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back, {profile?.full_name || 'User'}!</CardTitle>
                  <CardDescription>
                    Here's what's happening with your account today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">New notifications</p>
                        <p className="text-xs text-muted-foreground">
                          You have 2 new notifications to review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Order updates</p>
                        <p className="text-xs text-muted-foreground">
                          Your recent orders are being processed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your account quickly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <a 
                      href="/dashboard?tab=profile" 
                      className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm">Update Profile</span>
                    </a>
                    <a 
                      href="/dashboard?tab=orders" 
                      className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-sm">View Orders</span>
                    </a>
                    <a 
                      href="/dashboard?tab=cart" 
                      className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      <span className="text-sm">Manage Cart</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-14 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;