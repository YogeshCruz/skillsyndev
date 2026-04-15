import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle2, AlertTriangle, Trophy } from "lucide-react";
import { getRecommendationsWithCombinedScore, CombinedScoreResult } from "@/lib/job-matching";

interface JobRecommendationsProps {
  userSkills: string[];
  resumeScore: number;
}

const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

const JobRecommendations = ({ userSkills, resumeScore }: JobRecommendationsProps) => {
  const recommendations = useMemo(
    () => getRecommendationsWithCombinedScore(userSkills, resumeScore, 3),
    [userSkills, resumeScore]
  );

  if (!userSkills.length || recommendations.length === 0) return null;

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Top Job Recommendations
        </CardTitle>
        <CardDescription>
          Based on your extracted skills and resume score (combined score = 60% resume + 40% job match)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={rec.role} rec={rec} rank={index + 1} />
        ))}
      </CardContent>
    </Card>
  );
};

function RecommendationCard({ rec, rank }: { rec: CombinedScoreResult; rank: number }) {
  return (
    <Card className="p-4 border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className={`h-5 w-5 ${medalColors[rank - 1] || "text-muted-foreground"}`} />
          <h4 className="font-semibold text-base">{rec.role}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary font-semibold">
            {rec.match_percentage}% Match
          </Badge>
          <Badge variant="secondary" className="font-semibold">
            {rec.combined_score} Combined
          </Badge>
        </div>
      </div>

      <Progress value={rec.match_percentage} className="h-2 mb-3" />

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <h5 className="text-sm font-medium flex items-center gap-1 mb-1.5 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matching Skills ({rec.matching_skills.length})
          </h5>
          <div className="flex flex-wrap gap-1">
            {rec.matching_skills.map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                {skill}
              </Badge>
            ))}
            {rec.matching_skills.length === 0 && (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium flex items-center gap-1 mb-1.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Missing Skills ({rec.missing_skills.length})
          </h5>
          <div className="flex flex-wrap gap-1">
            {rec.missing_skills.map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400">
                {skill}
              </Badge>
            ))}
            {rec.missing_skills.length === 0 && (
              <span className="text-xs text-muted-foreground">None — perfect match!</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default JobRecommendations;
