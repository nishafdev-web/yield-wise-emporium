import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Shield,
  Leaf,
  AlertTriangle,
  Eye
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  isOrganic?: boolean;
  safetyLevel: "high" | "medium" | "low";
  inStock: boolean;
  discount?: number;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  category,
  isOrganic = false,
  safetyLevel,
  inStock,
  discount,
  onAddToCart,
  onAddToWishlist,
  onViewDetails
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getSafetyBadge = () => {
    switch (safetyLevel) {
      case "high":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <Shield className="w-3 h-3 mr-1" />
            High Safety
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Medium Risk
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            High Risk
          </Badge>
        );
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onAddToCart?.(id);
    trackEvent("add_to_cart", { product_id: id, product_name: name, price, category });
    setIsLoading(false);
  };

  const handleViewDetails = () => {
    trackEvent("product_view", { product_id: id, product_name: name, price, category });
    onViewDetails?.(id);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(id);
  };

  return (
    <Card className="agricultural-card group hover-lift overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {isOrganic && (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Leaf className="w-3 h-3 mr-1" />
              Organic
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={handleWishlist}
        >
          <Heart 
            className={`w-4 h-4 transition-smooth ${
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`} 
          />
        </Button>

        {/* Quick View Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 bg-primary/80 text-primary-foreground backdrop-blur-sm hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth"
          onClick={handleViewDetails}
        >
          <Eye className="w-4 h-4" />
        </Button>

        {/* Stock Status */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
          {name}
        </h3>

        {/* Safety Level */}
        <div className="mb-3">
          {getSafetyBadge()}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-warning text-warning"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group"
          onClick={handleAddToCart}
          disabled={!inStock || isLoading}
          variant={inStock ? "default" : "secondary"}
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-smooth" />
          {isLoading ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;