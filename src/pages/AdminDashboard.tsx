import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { OrdersManagement } from "@/components/admin/OrdersManagement";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "products";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to auth with return URL
        navigate("/auth?redirect=/admin");
      } else if (profile?.role !== "admin") {
        // Logged in but not admin - redirect to user dashboard
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need admin privileges to access the admin panel.",
        });
        navigate("/dashboard");
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (profile?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Unauthorized Access</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case "products":
        return <ProductsManagement />;
      case "orders":
        return <OrdersManagement />;
      case "users":
        return <UsersManagement />;
      default:
        return <ProductsManagement />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
          </header>
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
