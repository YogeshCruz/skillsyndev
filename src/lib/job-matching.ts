// Job Role Dataset - modular, can be replaced with DB-driven data later
export interface JobRoleDataset {
  [role: string]: string[];
}

export interface JobRecommendation {
  role: string;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
}

export interface CombinedScoreResult extends JobRecommendation {
  combined_score: number;
}

// Hardcoded dataset — replace with DB query when ready
export const JOB_ROLE_DATASET: JobRoleDataset = {
  "Frontend Developer": ["html", "css", "javascript", "react", "git"],
  "Backend Developer": ["node.js", "java", "sql", "api", "express"],
  "Data Analyst": ["python", "sql", "excel", "power bi", "statistics"],
  "Full Stack Developer": ["html", "css", "javascript", "react", "node.js", "sql"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "git", "linux", "ci/cd"],
  "Mobile Developer": ["javascript", "react", "typescript", "git", "api"],
  "Machine Learning Engineer": ["python", "sql", "statistics", "tensorflow", "numpy"],
};

/**
 * Case-insensitive skill comparison
 */
function skillsMatch(userSkill: string, jobSkill: string): boolean {
  return userSkill.toLowerCase().trim() === jobSkill.toLowerCase().trim();
}

/**
 * Match user skills against a single job role's required skills.
 */
function matchAgainstRole(userSkills: string[], roleSkills: string[]): { matching: string[]; missing: string[] } {
  const matching: string[] = [];
  const missing: string[] = [];

  for (const jobSkill of roleSkills) {
    const found = userSkills.some(us => skillsMatch(us, jobSkill));
    if (found) {
      matching.push(jobSkill);
    } else {
      missing.push(jobSkill);
    }
  }

  return { matching, missing };
}

/**
 * Calculate job recommendations for a user's extracted skills.
 * Returns all roles sorted by match percentage (descending).
 */
export function calculateJobMatches(
  userSkills: string[],
  dataset: JobRoleDataset = JOB_ROLE_DATASET
): JobRecommendation[] {
  if (!userSkills || userSkills.length === 0) return [];

  const results: JobRecommendation[] = Object.entries(dataset).map(([role, roleSkills]) => {
    const { matching, missing } = matchAgainstRole(userSkills, roleSkills);
    const match_percentage = roleSkills.length > 0
      ? Math.round((matching.length / roleSkills.length) * 100)
      : 0;

    return { role, match_percentage, matching_skills: matching, missing_skills: missing };
  });

  // Sort by highest match percentage
  results.sort((a, b) => b.match_percentage - a.match_percentage);
  return results;
}

/**
 * Get the top N job recommendations.
 */
export function getTopRecommendations(
  userSkills: string[],
  count = 3,
  dataset?: JobRoleDataset
): JobRecommendation[] {
  return calculateJobMatches(userSkills, dataset).slice(0, count);
}

/**
 * Calculate combined score: 60% resume score + 40% best job match score.
 */
export function calculateCombinedScore(
  resumeScore: number,
  jobMatchPercentage: number
): number {
  return Math.round(0.6 * resumeScore + 0.4 * jobMatchPercentage);
}

/**
 * Get top recommendations with combined scores.
 */
export function getRecommendationsWithCombinedScore(
  userSkills: string[],
  resumeScore: number,
  count = 3,
  dataset?: JobRoleDataset
): CombinedScoreResult[] {
  const recommendations = getTopRecommendations(userSkills, count, dataset);
  return recommendations.map(rec => ({
    ...rec,
    combined_score: calculateCombinedScore(resumeScore, rec.match_percentage),
  }));
}
