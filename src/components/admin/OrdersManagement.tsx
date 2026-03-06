import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, Download, Search, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRealtime } from "@/hooks/useRealtime";
import { StatusDot } from "./DashboardOverview";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  shipping_address: string;
  shipping_city: string;
  phone: string;
  profiles?: { email: string; full_name: string | null };
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: { name: string };
}

const statusBadgeVariant: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, profiles:user_id (email, full_name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const { status } = useRealtime("orders-management", [
    {
      table: "orders",
      onInsert: (newOrder) => {
        setOrders((prev) => [newOrder, ...prev]);
        setNewOrderIds((prev) => new Set(prev).add(newOrder.id));
        toast({
          title: "🛒 New Order Received!",
          description: `Order #${newOrder.id.slice(0, 8)} — Rs. ${newOrder.total_amount}`,
        });
        // Remove highlight after 5s
        setTimeout(() => {
          setNewOrderIds((prev) => {
            const next = new Set(prev);
            next.delete(newOrder.id);
            return next;
          });
        }, 5000);
        // Refetch to get profile join data
        fetchOrders();
      },
      onUpdate: (updated) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
        );
        toast({ title: "Order Updated", description: `Status changed to ${updated.status}` });
      },
      onDelete: (deleted) => {
        setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
        toast({ title: "Order Removed", variant: "destructive" });
      },
    },
  ]);

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`*, products (name)`)
        .eq("order_id", orderId);
      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      toast({ title: "✅ Status Updated", description: `Order status → ${newStatus}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const exportToCSV = () => {
    try {
      const headers = ["Order ID", "Customer", "Email", "Total Amount", "Status", "Date", "Phone", "Shipping City"];
      const rows = filteredOrders.map((o) => [
        o.id,
        o.profiles?.full_name || "N/A",
        o.profiles?.email || "N/A",
        o.total_amount,
        o.status,
        new Date(o.created_at).toLocaleDateString(),
        o.phone,
        o.shipping_city,
      ]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Exported", description: "Orders exported to CSV" });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.profiles?.email?.toLowerCase().includes(q) ||
      o.profiles?.full_name?.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      o.shipping_city.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <CardTitle>Orders Management</CardTitle>
            <StatusDot status={status} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-56"
              />
            </div>
            <Button onClick={fetchOrders} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={
                      newOrderIds.has(order.id)
                        ? "animate-in fade-in bg-green-50 dark:bg-green-950/20 transition-colors"
                        : "transition-colors"
                    }
                  >
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}…
                      {newOrderIds.has(order.id) && (
                        <Badge className="ml-2 text-xs bg-green-500 text-white">NEW</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.profiles?.full_name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{order.profiles?.email}</div>
                    </TableCell>
                    <TableCell className="font-semibold">Rs. {order.total_amount}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className={`w-32 text-xs border ${statusBadgeVariant[order.status]}`}>
                          {updatingStatus === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details — #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">Customer</h3>
                  <p className="text-sm"><span className="text-muted-foreground">Name:</span> {selectedOrder.profiles?.full_name || "N/A"}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Email:</span> {selectedOrder.profiles?.email}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {selectedOrder.phone}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Shipping</h3>
                  <p className="text-sm"><span className="text-muted-foreground">Address:</span> {selectedOrder.shipping_address}</p>
                  <p className="text-sm"><span className="text-muted-foreground">City:</span> {selectedOrder.shipping_city}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.products?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>Rs. {item.price}</TableCell>
                        <TableCell>Rs. {(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeVariant[selectedOrder.status]}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
                <div className="text-xl font-bold">Total: Rs. {selectedOrder.total_amount}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
