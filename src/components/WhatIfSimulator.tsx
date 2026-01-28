import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, RotateCcw, Zap } from "lucide-react";
import { JobMatch } from "@/hooks/useJobMatches";

interface SimulatedJobMatch extends JobMatch {
  simulated_percentage?: number;
  original_percentage?: number;
  improvement?: number;
}

interface WhatIfSimulatorProps {
  jobMatches: JobMatch[];
  userSkills: string[];
}

const WhatIfSimulator = ({ jobMatches, userSkills }: WhatIfSimulatorProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Get all unique missing skills across jobs
  const allMissingSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    jobMatches.forEach(job => {
      job.missing_skills?.forEach(skill => skillsSet.add(skill));
    });
    return Array.from(skillsSet);
  }, [jobMatches]);

  // Calculate impact for each skill
  const skillImpacts = useMemo(() => {
    return allMissingSkills.map(skill => {
      let totalImpact = 0;
      let affectedJobs = 0;

      jobMatches.forEach(job => {
        if (job.missing_skills?.includes(skill)) {
          const currentMatch = job.match_percentage || 0;
          const skillWeight = 100 / (job.required_skills?.length || 1);
          totalImpact += skillWeight;
          affectedJobs++;
        }
      });

      return {
        skill,
        avgImpact: affectedJobs > 0 ? totalImpact / affectedJobs : 0,
        affectedJobs,
      };
    }).sort((a, b) => b.avgImpact - a.avgImpact);
  }, [allMissingSkills, jobMatches]);

  // Simulate new match percentages
  const simulatedMatches: SimulatedJobMatch[] = useMemo(() => {
    if (selectedSkills.length === 0) return jobMatches;

    return jobMatches.map(job => {
      const newMatchingSkills = [...(job.matching_skills || [])];
      const newMissingSkills = (job.missing_skills || []).filter(
        skill => !selectedSkills.includes(skill)
      );

      selectedSkills.forEach(skill => {
        if (job.missing_skills?.includes(skill)) {
          newMatchingSkills.push(skill);
        }
      });

      const newPercentage = Math.round(
        (newMatchingSkills.length / (job.required_skills?.length || 1)) * 100
      );

      return {
        ...job,
        simulated_percentage: newPercentage,
        original_percentage: job.match_percentage,
        improvement: newPercentage - (job.match_percentage || 0),
      };
    }).sort((a, b) => (b.simulated_percentage || 0) - (a.simulated_percentage || 0));
  }, [jobMatches, selectedSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const totalImprovement = useMemo(() => {
    return simulatedMatches.reduce((acc, job) => acc + (job.improvement || 0), 0);
  }, [simulatedMatches]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">What-If Simulator</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skill Impact Simulator</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how learning new skills would improve your job match percentages instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Skills Selection Panel */}
          <Card className="lg:col-span-1 card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Select Skills to Learn
              </CardTitle>
              <CardDescription>
                Choose skills to simulate their impact on your matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {skillImpacts.slice(0, 15).map(({ skill, avgImpact, affectedJobs }) => (
                <div
                  key={skill}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedSkills.includes(skill)
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-card hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <div>
                      <p className="font-medium text-sm">{skill}</p>
                      <p className="text-xs text-muted-foreground">
                        Affects {affectedJobs} jobs
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-success">
                    +{Math.round(avgImpact)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Simulation Results */}
          <Card className="lg:col-span-2 card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Simulated Results
                  </CardTitle>
                  <CardDescription>
                    {selectedSkills.length > 0
                      ? `If you learned ${selectedSkills.length} skill(s)`
                      : 'Select skills to see potential improvements'}
                  </CardDescription>
                </div>
                {selectedSkills.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSkills([])}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
              {selectedSkills.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-success font-medium">
                    Total Potential Improvement: +{totalImprovement}% across all jobs
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4 max-h-[450px] overflow-y-auto">
              {simulatedMatches.slice(0, 8).map(job => (
                <div key={job.id} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{job.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {job.original_percentage || job.match_percentage}%
                      </span>
                      {(job.improvement || 0) > 0 && (
                        <>
                          <span className="text-primary">→</span>
                          <Badge className="bg-success text-success-foreground">
                            {job.simulated_percentage}%
                          </Badge>
                          <Badge variant="outline" className="text-success border-success">
                            +{job.improvement}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={job.original_percentage || job.match_percentage}
                      className="h-2"
                    />
                    {(job.improvement || 0) > 0 && (
                      <div
                        className="absolute top-0 h-2 bg-success/50 rounded-full transition-all"
                        style={{
                          left: `${job.original_percentage || job.match_percentage}%`,
                          width: `${job.improvement}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhatIfSimulator;
