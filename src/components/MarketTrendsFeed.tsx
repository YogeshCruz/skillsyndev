import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TrendItem {
  skill: string;
  change: number;
  category: string;
  demand: "high" | "medium" | "low";
}

const MarketTrendsFeed = () => {
  const trends: TrendItem[] = [
    { skill: "AI/ML Engineering", change: 45, category: "Technology", demand: "high" },
    { skill: "Cloud Architecture", change: 32, category: "Infrastructure", demand: "high" },
    { skill: "React/TypeScript", change: 28, category: "Frontend", demand: "high" },
    { skill: "Data Science", change: 15, category: "Analytics", demand: "medium" },
    { skill: "DevOps", change: 12, category: "Operations", demand: "medium" },
    { skill: "Cybersecurity", change: 38, category: "Security", demand: "high" },
    { skill: "Product Management", change: -5, category: "Business", demand: "medium" },
    { skill: "Mobile Development", change: 8, category: "Development", demand: "medium" },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 20) return <ArrowUp className="h-4 w-4 text-success" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-warning" />;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high": return "border-success text-success";
      case "medium": return "border-warning text-warning";
      case "low": return "border-muted text-muted-foreground";
      default: return "";
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Live Data</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Trends</h2>
            <p className="text-muted-foreground text-lg">
              Real-time insights on in-demand skills and emerging opportunities
            </p>
          </div>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Trending Skills This Month</CardTitle>
              <CardDescription>
                Track which skills are growing in demand across industries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.change)}
                        <span className={`font-semibold ${
                          trend.change > 0 ? 'text-success' : 
                          trend.change < 0 ? 'text-destructive' : 
                          'text-warning'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{trend.skill}</h4>
                        <p className="text-sm text-muted-foreground">{trend.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getDemandColor(trend.demand)}>
                      {trend.demand} demand
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">342K</div>
                <div className="text-sm text-muted-foreground">Active Job Openings</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">68%</div>
                <div className="text-sm text-muted-foreground">Avg. Salary Increase</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">2.4x</div>
                <div className="text-sm text-muted-foreground">Growth vs Last Year</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrendsFeed;
