import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { Target } from "lucide-react";

const SkillMapVisualizer = () => {
  const skillData = [
    { skill: "Programming", current: 85, target: 95, fullMark: 100 },
    { skill: "Database", current: 70, target: 90, fullMark: 100 },
    { skill: "Cloud", current: 60, target: 85, fullMark: 100 },
    { skill: "DevOps", current: 55, target: 80, fullMark: 100 },
    { skill: "Testing", current: 75, target: 90, fullMark: 100 },
    { skill: "Soft Skills", current: 80, target: 95, fullMark: 100 },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Interactive Visualization</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Skill Map</h2>
            <p className="text-muted-foreground text-lg">
              Visual overview of your skills vs. target job requirements
            </p>
          </div>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Skill Radar Chart</CardTitle>
              <CardDescription>
                Compare your current skills (yellow) with target role requirements (white outline)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid strokeOpacity={0.3} stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="skill" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Radar
                    name="Target Level"
                    dataKey="target"
                    stroke="hsl(var(--foreground))"
                    fill="hsl(var(--foreground))"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Your Skills"
                    dataKey="current"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Legend 
                    wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {skillData.map((item) => (
              <Card key={item.skill} className="card-elevated">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{item.skill}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{item.current}%</span>
                    <span className="text-sm text-muted-foreground">/ {item.target}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${item.current}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillMapVisualizer;
