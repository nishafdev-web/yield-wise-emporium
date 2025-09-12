import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./ProductCard";
import { 
  Filter, 
  Search, 
  Grid3X3, 
  List,
  SlidersHorizontal
} from "lucide-react";
import productImage from "@/assets/product-pesticide-1.jpg";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Premium Organic Insecticide - Natural Plant Protection",
    image: productImage,
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviewCount: 128,
    category: "Insecticides",
    isOrganic: true,
    safetyLevel: "high" as const,
    inStock: true,
    discount: 23,
  },
  {
    id: "2", 
    name: "Advanced Fungicide for Crop Disease Prevention",
    image: productImage,
    price: 32.50,
    rating: 4.6,
    reviewCount: 94,
    category: "Fungicides",
    isOrganic: false,
    safetyLevel: "medium" as const,
    inStock: true,
  },
  {
    id: "3",
    name: "Bio-Based Herbicide - Weed Control Solution",
    image: productImage,
    price: 67.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviewCount: 203,
    category: "Herbicides",
    isOrganic: true,
    safetyLevel: "high" as const,
    inStock: false,
    discount: 15,
  },
  {
    id: "4",
    name: "Multi-Purpose Plant Fertilizer with Micronutrients",
    image: productImage,
    price: 28.75,
    rating: 4.4,
    reviewCount: 76,
    category: "Fertilizers",
    isOrganic: false,
    safetyLevel: "high" as const,
    inStock: true,
  },
  {
    id: "5",
    name: "Professional Rodenticide - Farm Protection",
    image: productImage,
    price: 89.99,
    rating: 4.2,
    reviewCount: 45,
    category: "Rodenticides",
    isOrganic: false,
    safetyLevel: "low" as const,
    inStock: true,
  },
  {
    id: "6",
    name: "Organic Soil Conditioner - Root Enhancement",
    image: productImage,
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.7,
    reviewCount: 156,
    category: "Soil Care",
    isOrganic: true,
    safetyLevel: "high" as const,
    inStock: true,
    discount: 29,
  },
];

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSafety, setSelectedSafety] = useState("all");
  const [isOrganic, setIsOrganic] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(mockProducts.map(p => p.category)))];

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSafety = selectedSafety === "all" || product.safetyLevel === selectedSafety;
    const matchesOrganic = !isOrganic || product.isOrganic;
    
    return matchesSearch && matchesCategory && matchesSafety && matchesOrganic;
  });

  const handleAddToCart = (id: string) => {
    console.log("Added to cart:", id);
    // Implement cart logic here
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Added to wishlist:", id);
    // Implement wishlist logic here
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
    // Implement navigation to product details
  };

  return (
    <section className="py-16 bg-gradient-subtle">
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
                {(selectedCategory !== "all" || selectedSafety !== "all" || isOrganic) && (
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
              {filteredProducts.length} products found
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
                      checked={isOrganic}
                      onChange={(e) => setIsOrganic(e.target.checked)}
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
                      setIsOrganic(false);
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
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product, index) => (
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

        {/* No Results */}
        {filteredProducts.length === 0 && (
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
                setIsOrganic(false);
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