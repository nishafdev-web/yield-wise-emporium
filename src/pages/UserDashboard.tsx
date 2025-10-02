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
          <Card className="shadow-card border-0">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-2xl">Account Settings</CardTitle>
              <CardDescription className="text-base">Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Account settings coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Stats Cards with Material Design Elevation */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Orders
                  </CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">12</div>
                  <p className="text-sm text-success mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Cart Items
                  </CardTitle>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">3</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Items ready for checkout
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-earth/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Spent
                  </CardTitle>
                  <div className="p-2 bg-earth/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-earth" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">₹2,450</div>
                  <p className="text-sm text-success mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +₹180 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Active Status
                  </CardTitle>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-success" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">Active</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Account in good standing
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid with Enhanced Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-card border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                  <CardTitle className="text-xl">Welcome back, {profile?.full_name || 'User'}!</CardTitle>
                  <CardDescription className="text-base">
                    Here's what's happening with your account today.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl transition-all duration-300 hover:from-primary/10 hover:shadow-soft cursor-pointer group">
                      <div className="p-3 bg-primary rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Bell className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">New notifications</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          You have 2 new notifications to review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-xl transition-all duration-300 hover:from-accent/10 hover:shadow-soft cursor-pointer group">
                      <div className="p-3 bg-accent rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Package className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Order updates</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Your recent orders are being processed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-earth/5 to-transparent pb-4">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription className="text-base">
                    Manage your account quickly
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <a 
                      href="/dashboard?tab=profile" 
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl transition-all duration-300 hover:from-primary/10 hover:shadow-soft cursor-pointer group border border-transparent hover:border-primary/20"
                    >
                      <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <User className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Update Profile</span>
                    </a>
                    <a 
                      href="/dashboard?tab=orders" 
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl transition-all duration-300 hover:from-accent/10 hover:shadow-soft cursor-pointer group border border-transparent hover:border-accent/20"
                    >
                      <div className="p-2.5 bg-accent/10 rounded-lg group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                        <Package className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">View Orders</span>
                    </a>
                    <a 
                      href="/dashboard?tab=cart" 
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl transition-all duration-300 hover:from-earth/10 hover:shadow-soft cursor-pointer group border border-transparent hover:border-earth/20"
                    >
                      <div className="p-2.5 bg-earth/10 rounded-lg group-hover:bg-earth group-hover:scale-110 transition-all duration-300">
                        <ShoppingCart className="h-4 w-4 text-earth group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-earth transition-colors">Manage Cart</span>
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/20 to-background">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-16 flex items-center border-b bg-card/50 backdrop-blur-sm px-6 shadow-soft sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Welcome back, {profile?.full_name}</p>
            </div>
          </header>
          <main className="flex-1 p-8 max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;