import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={3} />
      <HeroSection />
      <ProductGrid />
    </div>
  );
};

export default Index;
