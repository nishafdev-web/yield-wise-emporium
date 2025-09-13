import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { 
  Search, 
  Grid3X3, 
  List,
  SlidersHorizontal
} from "lucide-react";
import productImage from "@/assets/product-pesticide-1.jpg";

// Transform product data for ProductCard component
const transformProduct = (product: any, averageRating: number = 4.5, reviewCount: number = 0) => ({
  id: product.id,
  name: product.name,
  image: product.image_url || productImage,
  price: product.price,
  originalPrice: product.original_price,
  rating: averageRating,
  reviewCount,
  category: product.category,
  isOrganic: product.is_organic,
  safetyLevel: product.safety_level as "high" | "medium" | "low",
  inStock: product.stock > 0,
  discount: product.original_price ? 
    Math.round(((product.original_price - product.price) / product.original_price) * 100) : 
    undefined,
});

interface ProductGridProps {
  searchQuery?: string;
}

const ProductGrid = ({ searchQuery: externalSearchQuery }: ProductGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSafety, setSelectedSafety] = useState("all");
  const [isOrganic, setIsOrganic] = useState<boolean | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Use cart functionality
  const { addToCart } = useCart();

  // Use external search query if provided, otherwise use internal state
  const activeSearchQuery = externalSearchQuery || searchQuery;

  // Update internal search when external search changes
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Fetch products from Supabase
  const { products, loading, error } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: activeSearchQuery || undefined,
    safetyLevel: selectedSafety === "all" ? undefined : selectedSafety,
    isOrganic: isOrganic,
  });

  // Extract unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  // Transform products for ProductCard component
  const transformedProducts = products.map(product => 
    transformProduct(product, 4.5, Math.floor(Math.random() * 200) + 50)
  );

  const handleAddToCart = async (id: string) => {
    await addToCart(id, 1);
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Added to wishlist:", id);
    // TODO: Implement wishlist logic here
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
    // TODO: Navigate to product details page
  };

  return (
    <section id="products" className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Premium Agricultural Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of certified pesticides, fertilizers, and farming solutions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-card shadow-soft border-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(selectedCategory !== "all" || selectedSafety !== "all" || isOrganic === true) && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    Active
                  </Badge>
                )}
              </Button>

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg p-1 bg-card">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${transformedProducts.length} products found`}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Safety Level Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Safety Level
                  </label>
                  <Select value={selectedSafety} onValueChange={setSelectedSafety}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Safety Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Safety Levels</SelectItem>
                      <SelectItem value="high">High Safety</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organic Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Product Type
                  </label>
                  <div className="flex items-center space-x-2 h-10">
                    <input
                      type="checkbox"
                      id="organic"
                      checked={isOrganic === true}
                      onChange={(e) => setIsOrganic(e.target.checked ? true : undefined)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="organic" className="text-sm text-foreground">
                      Organic Only
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSafety("all");
                      setIsOrganic(undefined);
                      setSearchQuery("");
                    }}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Error Loading Products
            </h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {transformedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProductCard
                  {...product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && transformedProducts.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSafety("all");
                setIsOrganic(undefined);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;