import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Award,
  ChevronDown
} from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const HeroSection = () => {
  console.log("HeroSection component rendering");
  
  const handleShopNow = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSafetyGuide = () => {
    const safetySection = document.getElementById('safety');
    if (safetySection) {
      safetySection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Certified Safe Products"
    },
    {
      icon: <Truck className="w-5 h-5" />,
      text: "Fast Delivery"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Expert Support"

    }
  ];

  const stats = [
    { value: "10,000+", label: "Products" },
    { value: "50,000+", label: "Happy Farmers" },
    { value: "99.9%", label: "Delivery Success" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Content */}
      <div className="relative bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-smooth">
                🌿 Trusted by 50,000+ Farmers
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Premium 
                <span className="text-accent"> Agricultural </span>
                Solutions
              </h1>
              
              <p className="text-lg lg:text-xl text-primary-foreground/90 mb-8 max-w-2xl">
                Discover high-quality pesticides, fertilizers, and farming tools. 
                Safe, effective, and delivered directly to your farm with expert guidance.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20"
                  >
                    <span className="text-accent">{feature.icon}</span>
                    <span className="text-primary-foreground text-sm font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent-light text-accent-foreground shadow-lg hover-lift group"
                  onClick={handleShopNow}
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
                  onClick={handleSafetyGuide}
                >
                  Safety Guide
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-primary-foreground/80 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="relative overflow-hidden rounded-2xl shadow-elegant">
                <img
                  src={heroImage}
                  alt="Professional farmer in agricultural field with modern farming equipment"
                  className="w-full h-[400px] lg:h-[500px] object-cover hover-scale"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-card border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Expert Support</h3>
                      <p className="text-sm text-muted-foreground">24/7 Agricultural Guidance</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      Available
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2"></div>
          </div>
          <ChevronDown className="w-4 h-4 text-primary-foreground/50 mx-auto mt-2" />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}></div>
    </section>
  );
};

export default HeroSection;