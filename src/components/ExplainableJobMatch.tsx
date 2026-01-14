import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle, Lightbulb, TrendingUp } from "lucide-react";

interface ExplainableJobMatchProps {
  job: {
    id: string;
    title: string;
    match_percentage?: number;
    matching_skills?: string[];
    missing_skills?: string[];
    required_skills: string[];
  };
  userSkills: string[];
  onSimulateSkill?: (skill: string) => void;
}

const ExplainableJobMatch = ({ job, userSkills, onSimulateSkill }: ExplainableJobMatchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Categorize skills
  const strongMatches = job.matching_skills?.filter(skill => 
    userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
  ) || [];
  
  const partialMatches = job.matching_skills?.filter(skill => 
    userSkills.some(us => 
      (us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase())) &&
      us.toLowerCase() !== skill.toLowerCase()
    )
  ) || [];
  
  const missingSkills = job.missing_skills || [];

  const getMatchExplanation = () => {
    const percentage = job.match_percentage || 0;
    if (percentage >= 80) return "Excellent match! You have most of the required skills.";
    if (percentage >= 60) return "Strong match with some skills to develop.";
    if (percentage >= 40) return "Moderate match. Several skills could boost your candidacy.";
    return "Developing match. Focus on key skills to improve.";
  };

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{job.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary">
              {job.match_percentage || 0}% Match
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{getMatchExplanation()}</p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Match Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Why This Match Score?
            </h4>
            
            {/* Strong Matches */}
            {strongMatches.length > 0 && (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">Strong Matches ({strongMatches.length})</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  These skills directly match job requirements and boost your score significantly.
                </p>
                <div className="flex flex-wrap gap-1">
                  {strongMatches.map(skill => (
                    <Badge key={skill} className="bg-success/20 text-success border-success/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Partial Matches */}
            {partialMatches.length > 0 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="font-medium text-warning">Partial Matches ({partialMatches.length})</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Related skills that partially meet requirements. Consider deepening these.
                </p>
                <div className="flex flex-wrap gap-1">
                  {partialMatches.map(skill => (
                    <Badge key={skill} className="bg-warning/20 text-warning border-warning/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Missing Skills ({missingSkills.length})</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Learning these skills would improve your match. Click to simulate impact.
                </p>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.map(skill => (
                    <Badge 
                      key={skill} 
                      className="bg-destructive/20 text-destructive border-destructive/30 cursor-pointer hover:bg-destructive/30 transition-colors"
                      onClick={() => onSimulateSkill?.(skill)}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visual Score Breakdown */}
          <div className="pt-2 border-t border-border">
            <h4 className="font-medium mb-3">Score Contribution</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Strong Matches</span>
                <span className="text-success">+{Math.round((strongMatches.length / job.required_skills.length) * 100)}%</span>
              </div>
              <Progress value={(strongMatches.length / job.required_skills.length) * 100} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Partial Matches</span>
                <span className="text-warning">+{Math.round((partialMatches.length / job.required_skills.length) * 50)}%</span>
              </div>
              <Progress value={(partialMatches.length / job.required_skills.length) * 50} className="h-2" />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExplainableJobMatch;
