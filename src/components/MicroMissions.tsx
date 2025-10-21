import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Trophy, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Mission {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: string;
}

const MicroMissions = () => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Complete a SQL Tutorial",
      description: "Finish any SQL basics course or tutorial",
      xp: 50,
      completed: false,
      category: "Learning",
    },
    {
      id: 2,
      title: "Update LinkedIn Headline",
      description: "Optimize your LinkedIn headline with target role keywords",
      xp: 30,
      completed: true,
      category: "Profile",
    },
    {
      id: 3,
      title: "Add a Soft Skill",
      description: "Add one communication or leadership skill to your profile",
      xp: 20,
      completed: false,
      category: "Skills",
    },
    {
      id: 4,
      title: "Practice an Interview Question",
      description: "Complete one technical interview question with answer",
      xp: 40,
      completed: false,
      category: "Interview",
    },
    {
      id: 5,
      title: "Review a Job Match",
      description: "Analyze skill gaps for one recommended job role",
      xp: 25,
      completed: true,
      category: "Jobs",
    },
    {
      id: 6,
      title: "Watch a Career Video",
      description: "Complete a career development or skill-building video",
      xp: 15,
      completed: false,
      category: "Learning",
    },
  ]);

  const totalXP = missions.reduce((sum, m) => sum + (m.completed ? m.xp : 0), 0);
  const maxXP = missions.reduce((sum, m) => sum + m.xp, 0);
  const completionRate = Math.round((totalXP / maxXP) * 100);

  const toggleMission = (id: number) => {
    setMissions(
      missions.map((m) => {
        if (m.id === id) {
          const newCompleted = !m.completed;
          if (newCompleted) {
            toast({
              title: "Mission Complete! 🎉",
              description: `You earned ${m.xp} XP!`,
            });
          }
          return { ...m, completed: newCompleted };
        }
        return m;
      })
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Learning": return "border-primary text-primary";
      case "Profile": return "border-success text-success";
      case "Skills": return "border-warning text-warning";
      case "Interview": return "border-destructive text-destructive";
      case "Jobs": return "border-accent text-accent";
      default: return "";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Weekly Challenges</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Micro-Missions</h2>
            <p className="text-muted-foreground text-lg">
              Complete small tasks to build momentum and earn XP
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="card-glow mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary glow-yellow" />
                  <div>
                    <h3 className="text-xl font-bold">This Week's Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalXP} / {maxXP} XP earned
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{completionRate}%</div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={completionRate} className="h-3" />
            </CardContent>
          </Card>

          {/* Missions List */}
          <div className="space-y-4">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className={`card-elevated transition-all cursor-pointer ${
                  mission.completed ? "opacity-60" : "hover:card-glow"
                }`}
                onClick={() => toggleMission(mission.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {mission.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getCategoryColor(mission.category)}>
                            {mission.category}
                          </Badge>
                          <Badge variant="secondary" className="text-primary">
                            +{mission.xp} XP
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{mission.title}</CardTitle>
                        <CardDescription className="mt-1">{mission.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Leaderboard Preview */}
          <Card className="card-elevated mt-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Weekly Leaderboard</CardTitle>
              </div>
              <CardDescription>See how you rank against other learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Sarah Chen", xp: 840, isYou: false },
                  { rank: 2, name: "You", xp: totalXP, isYou: true },
                  { rank: 3, name: "Mike Rodriguez", xp: 720, isYou: false },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.isYou ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">#{user.rank}</span>
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MicroMissions;
