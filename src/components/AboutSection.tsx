import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Truck,
  Shield,
  Star,
  Globe,
  Phone,
  Mail
} from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '50,000+', label: 'Happy Farmers' },
    { icon: <Award className="w-6 h-6" />, value: '15+', label: 'Years Experience' },
    { icon: <Truck className="w-6 h-6" />, value: '99.9%', label: 'On-Time Delivery' },
    { icon: <Shield className="w-6 h-6" />, value: '100%', label: 'Quality Assured' }
  ];

  const features = [
    {
      title: 'Expert Consultation',
      description: 'Get personalized advice from our agricultural experts',
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Quality Guarantee', 
      description: 'All products are certified and quality tested',
      icon: <Award className="w-5 h-5" />
    },
    {
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep',
      icon: <Truck className="w-5 h-5" />
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support and assistance',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  return (
    <section id="about" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Globe className="w-4 h-4 mr-2" />
            About AgroMart
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Trusted Agricultural Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            For over 15 years, AgroMart has been at the forefront of providing premium agricultural solutions 
            to farmers across the region. Our commitment to quality, safety, and innovation has made us the 
            preferred choice for sustainable farming practices.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label}
              className="text-center border-border hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Why Choose AgroMart?
            </h3>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Us
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Get Support
              </Button>
            </div>
          </div>

          {/* Right Content - Mission */}
          <div className="lg:pl-8">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Our Mission
                  </h3>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "To empower farmers with innovative, safe, and sustainable agricultural solutions that 
                  enhance crop productivity while protecting the environment for future generations."
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Sustainable farming practices</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Environmental stewardship</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Farmer education and support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;