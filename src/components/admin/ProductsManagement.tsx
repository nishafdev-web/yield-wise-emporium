import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input as SearchInput } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Search, RefreshCw } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import { StatusDot } from "./DashboardOverview";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 chars"),
  description: z.string().max(500, "Max 500 chars").optional(),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be a positive number"),
  original_price: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) > 0), "Must be a positive number"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, "Must be 0 or more"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_organic: z.boolean().default(false),
  safety_level: z.enum(["low", "medium", "high"]).default("medium"),
  usage_instructions: z.string().max(1000, "Max 1000 chars").optional(),
  safety_guidelines: z.string().max(1000, "Max 1000 chars").optional(),
});

type ProductForm = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  original_price: number | null;
  stock: number;
  image_url: string | null;
  is_organic: boolean | null;
  safety_level: string | null;
  usage_instructions: string | null;
  safety_guidelines: string | null;
}

const safetyColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      original_price: "",
      stock: "0",
      image_url: "",
      is_organic: false,
      safety_level: "medium",
      usage_instructions: "",
      safety_guidelines: "",
    },
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const { status } = useRealtime("products-management", [
    {
      table: "products",
      onInsert: (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        toast({ title: "📦 Product Added", description: `"${newProduct.name}" was added` });
      },
      onUpdate: (updated) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
        );
        toast({ title: "✏️ Product Updated", description: `"${updated.name}" was updated` });
      },
      onDelete: (deleted) => {
        setProducts((prev) => prev.filter((p) => p.id !== deleted.id));
        toast({ title: "🗑️ Product Deleted", variant: "destructive" });
      },
    },
  ]);

  const onSubmit = async (data: ProductForm) => {
    setSubmitting(true);
    try {
      const productData = {
        name: data.name,
        description: data.description || null,
        category: data.category,
        price: parseFloat(data.price),
        original_price: data.original_price ? parseFloat(data.original_price) : null,
        stock: parseInt(data.stock),
        image_url: data.image_url || null,
        is_organic: data.is_organic,
        safety_level: data.safety_level,
        usage_instructions: data.usage_instructions || null,
        safety_guidelines: data.safety_guidelines || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: "✅ Product Updated", description: `"${data.name}" saved successfully` });
      } else {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast({ title: "✅ Product Created", description: `"${data.name}" added successfully` });
      }

      setDialogOpen(false);
      form.reset();
      setEditingProduct(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      is_organic: product.is_organic || false,
      safety_level: (product.safety_level as "low" | "medium" | "high") || "medium",
      usage_instructions: product.usage_instructions || "",
      safety_guidelines: product.safety_guidelines || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", deleteProduct.id);
      if (error) throw error;
      toast({ title: "Product Deleted", description: `"${deleteProduct.name}" removed` });
      setDeleteProduct(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.safety_level?.toLowerCase().includes(q)
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CardTitle>Products Management</CardTitle>
          <StatusDot status={status} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <SearchInput
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-52"
            />
          </div>
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingProduct(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl><Input placeholder="Product name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Product description" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl><Input placeholder="e.g. Pesticides" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="safety_level" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Safety Level</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (Rs.) *</FormLabel>
                        <FormControl><Input type="number" step="0.01" min="0" placeholder="0.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="original_price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price</FormLabel>
                        <FormControl><Input type="number" step="0.01" min="0" placeholder="0.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="stock" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock *</FormLabel>
                        <FormControl><Input type="number" min="0" placeholder="0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="image_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex items-center gap-2">
                    <FormField control={form.control} name="is_organic" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded"
                          />
                        </FormControl>
                        <FormLabel className="m-0">Organic Product</FormLabel>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="usage_instructions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Instructions</FormLabel>
                      <FormControl><Textarea placeholder="How to use..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="safety_guidelines" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safety Guidelines</FormLabel>
                      <FormControl><Textarea placeholder="Safety info..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No products found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Safety</TableHead>
                <TableHead>Organic</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="animate-in fade-in transition-all">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rs. {product.price}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "outline"}>
                      {product.stock === 0 ? "Out of Stock" : product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${safetyColors[product.safety_level || "medium"]}`}>
                      {product.safety_level}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.is_organic ? (
                      <Badge variant="outline" className="text-green-700 border-green-300">Organic</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteProduct(product)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteProduct?.name}"</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
