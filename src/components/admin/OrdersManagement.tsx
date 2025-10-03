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
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
  };
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          *,
          products (
            name
          )
        `)
        .eq("order_id", orderId);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      toast({ title: "Success", description: "Order status updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const exportToCSV = () => {
    try {
      const headers = ["Order ID", "Customer", "Email", "Total Amount", "Status", "Date", "Phone", "Shipping City"];
      const csvData = orders.map(order => [
        order.id,
        order.profiles?.full_name || "N/A",
        order.profiles?.email || "N/A",
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleDateString(),
        order.phone,
        order.shipping_city,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `orders-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Orders exported to CSV successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to export orders",
        variant: "destructive",
      });
    }
  };

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Orders Management</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.profiles?.full_name || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                      disabled={updatingStatus === order.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
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
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.profiles?.full_name || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.profiles?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {selectedOrder.phone}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <p className="text-sm">
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.shipping_address}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">City:</span>{" "}
                    {selectedOrder.shipping_city}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.products?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
                <div className="text-xl font-bold">
                  Total: ${selectedOrder.total_amount}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
