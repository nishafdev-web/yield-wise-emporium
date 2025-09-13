import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  console.log("Index component rendering");
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartCount} onSearch={handleSearch} />
      <HeroSection />
      <ProductGrid searchQuery={searchQuery} />
    </div>
  );
};

export default Index;
