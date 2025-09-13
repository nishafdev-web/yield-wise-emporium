import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Droplets,
  Wind
} from "lucide-react";

const SafetySection = () => {
  const safetyLevels = [
    {
      level: 'High Safety',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600 border-green-200',
      description: 'Minimal risk products safe for organic farming',
      guidelines: [
        'Safe for beneficial insects',
        'No protective equipment required',
        'Suitable for organic certification',
        'Minimal environmental impact'
      ]
    },
    {
      level: 'Medium Risk',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      description: 'Moderate risk requiring basic precautions',
      guidelines: [
        'Use protective gloves',
        'Avoid contact with skin',
        'Read label instructions carefully',
        'Store in cool, dry place'
      ]
    },
    {
      level: 'High Risk',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600 border-red-200',
      description: 'Professional use requiring full protection',
      guidelines: [
        'Full protective equipment required',
        'Professional application only',
        'Keep away from water sources',
        'Follow strict storage protocols'
      ]
    }
  ];

  const safetyTips = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Read Labels Carefully',
      description: 'Always read and follow product labels and safety instructions'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Use Protection',
      description: 'Wear appropriate protective equipment as recommended'
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      title: 'Proper Storage',
      description: 'Store products in original containers in secure locations'
    },
    {
      icon: <Wind className="w-5 h-5" />,
      title: 'Weather Awareness',
      description: 'Apply during appropriate weather conditions to avoid drift'
    }
  ];

  return (
    <section id="safety" className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Safety Guidelines
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your safety and environmental protection are our top priorities
          </p>
        </div>

        {/* Safety Levels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {safetyLevels.map((safety, index) => (
            <Card 
              key={safety.level}
              className="border-border hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Badge className={`${safety.color} mb-3`}>
                    {safety.icon}
                    <span className="ml-2">{safety.level}</span>
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    {safety.description}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {safety.guidelines.map((guideline, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Safety Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyTips.map((tip, index) => (
            <Card 
              key={tip.title}
              className="text-center hover-lift border-border hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {tip.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetySection;