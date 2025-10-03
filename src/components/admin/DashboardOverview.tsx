import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  newSignups: number;
}

interface RecentActivity {
  id: string;
  verb: string;
  object_type: string;
  created_at: string;
  actor_user_id: string;
}

export const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    newSignups: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for activity feed
    const channel = supabase
      .channel('dashboard-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          setRecentActivity(prev => [payload.new as RecentActivity, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total orders and revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, created_at');

      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = ordersData?.length || 0;

      // Fetch new signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: newSignupsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalUsers: usersCount || 0,
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        newSignups: newSignupsCount || 0,
      });

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "All time revenue",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Completed orders",
    },
    {
      title: "New Signups (7d)",
      value: stats.newSignups,
      icon: TrendingUp,
      description: "Last 7 days",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm border-l-2 border-primary pl-3 py-2"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {activity.verb} {activity.object_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
