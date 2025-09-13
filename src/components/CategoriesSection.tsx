import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Bug, 
  Leaf, 
  Tractor,
  Shield,
  Droplets
} from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      id: 'insecticides',
      name: 'Insecticides',
      icon: <Bug className="w-8 h-8" />,
      description: 'Effective pest control solutions',
      productCount: '250+',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'herbicides',
      name: 'Herbicides',
      icon: <Leaf className="w-8 h-8" />,
      description: 'Weed control and management',
      productCount: '180+',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'fungicides',
      name: 'Fungicides',
      icon: <Shield className="w-8 h-8" />,
      description: 'Disease prevention solutions',
      productCount: '120+',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'fertilizers',
      name: 'Fertilizers',
      icon: <Sprout className="w-8 h-8" />,
      description: 'Growth enhancement nutrients',
      productCount: '200+',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'equipment',
      name: 'Equipment',
      icon: <Tractor className="w-8 h-8" />,
      description: 'Farming tools and machinery',
      productCount: '150+',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'irrigation',
      name: 'Irrigation',
      icon: <Droplets className="w-8 h-8" />,
      description: 'Water management systems',
      productCount: '80+',
      color: 'bg-cyan-100 text-cyan-600'
    }
  ];

  return (
    <section id="categories" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of agricultural solutions organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="hover-lift cursor-pointer group border-border hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {category.productCount}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;