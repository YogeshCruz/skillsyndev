import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for exploring career opportunities",
      features: [
        "Upload 1 resume",
        "Basic skill analysis",
        "5 job matches per month",
        "Standard learning recommendations",
        "Basic dashboard",
      ],
      buttonText: "Get Started Free",
      isPopular: false,
    },
    {
      name: "Professional",
      price: "$19",
      priceSubtext: "/month",
      description: "Ideal for active job seekers",
      features: [
        "Upload unlimited resumes",
        "Advanced AI skill analysis",
        "Unlimited job matches",
        "Premium learning recommendations", 
        "Advanced analytics dashboard",
        "Priority support",
        "Custom career roadmaps",
      ],
      buttonText: "Start Pro Trial",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and organizations",
      features: [
        "Everything in Professional",
        "Team management tools",
        "Bulk resume processing",
        "Custom integrations",
        "Advanced reporting",
        "Dedicated account manager",
        "Custom training programs",
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as your career grows. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.isPopular ? 'ring-2 ring-primary scale-105' : ''} hover:shadow-lg transition-all duration-300`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceSubtext && (
                    <span className="text-muted-foreground ml-1">{plan.priceSubtext}</span>
                  )}
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.isPopular ? 'bg-primary hover:bg-primary-hover' : ''}`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include our core features and 24/7 customer support
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              30-day money back guarantee
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;