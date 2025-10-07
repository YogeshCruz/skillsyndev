import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Award, Zap, Star, TrendingUp } from "lucide-react";

interface Achievement {
  id: number;
  icon: any;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const Gamification = () => {
  const achievements: Achievement[] = [
    {
      id: 1,
      icon: Trophy,
      title: "First Upload",
      description: "Upload your first resume",
      unlocked: true
    },
    {
      id: 2,
      icon: Target,
      title: "Skill Explorer",
      description: "View 10 job matches",
      unlocked: true
    },
    {
      id: 3,
      icon: Award,
      title: "Resume Master",
      description: "Achieve 90+ resume score",
      unlocked: false,
      progress: 75,
      maxProgress: 90
    },
    {
      id: 4,
      icon: Zap,
      title: "Quick Learner",
      description: "Complete 5 learning modules",
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: 5,
      icon: Star,
      title: "Career Aligner",
      description: "Match with 3 perfect roles (95%+)",
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Growth Mindset",
      description: "Improve skills for 30 days straight",
      unlocked: false,
      progress: 7,
      maxProgress: 30
    }
  ];

  const level = 5;
  const currentXP = 750;
  const nextLevelXP = 1000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Achievements</h2>
            <p className="text-muted-foreground text-lg">
              Track your progress and unlock career milestones
            </p>
          </div>

          {/* Level Progress */}
          <Card className="card-glow mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Level {level}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentXP} / {nextLevelXP} XP to next level
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-8 w-8 text-primary glow-yellow" />
                </div>
              </div>
              <Progress value={xpProgress} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">
                Earn XP by completing learning modules, improving your resume, and matching with jobs
              </p>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`card-elevated transition-all ${
                  achievement.unlocked ? 'card-glow' : 'opacity-60'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <achievement.icon className={`h-6 w-6 ${
                        achievement.unlocked ? 'glow-yellow' : ''
                      }`} />
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="border-success text-success">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-4">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">6</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">2</div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{currentXP}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
