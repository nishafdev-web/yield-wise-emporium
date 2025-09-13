import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CategoriesSection from "@/components/CategoriesSection";
import SafetySection from "@/components/SafetySection";
import AboutSection from "@/components/AboutSection";
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
      <CategoriesSection />
      <SafetySection />
      <AboutSection />
    </div>
  );
};

export default Index;
