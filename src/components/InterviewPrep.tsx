import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface InterviewQuestion {
  id: number;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  hint: string;
  answer: string;
}

const InterviewPrep = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  
  const questions: InterviewQuestion[] = [
    {
      id: 1,
      question: "Explain the difference between let, const, and var in JavaScript",
      difficulty: "Easy",
      category: "JavaScript",
      hint: "Think about scope, reassignment, and hoisting",
      answer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned."
    },
    {
      id: 2,
      question: "What is React's Virtual DOM and how does it improve performance?",
      difficulty: "Medium",
      category: "React",
      hint: "Consider how React handles UI updates",
      answer: "Virtual DOM is a lightweight copy of the actual DOM. React compares it with the real DOM (reconciliation) and only updates changed parts, making updates more efficient."
    },
    {
      id: 3,
      question: "Implement a debounce function in JavaScript",
      difficulty: "Medium",
      category: "JavaScript",
      hint: "Use setTimeout and clearTimeout",
      answer: "A debounce function delays execution until after a specified time has passed since the last call, useful for rate-limiting."
    },
    {
      id: 4,
      question: "Explain the concept of closures and provide a practical use case",
      difficulty: "Hard",
      category: "JavaScript",
      hint: "Think about data privacy and function factories",
      answer: "Closures allow functions to access variables from their outer scope even after the outer function has returned. Useful for data privacy and creating function factories."
    },
    {
      id: 5,
      question: "How would you optimize a React application for performance?",
      difficulty: "Hard",
      category: "React",
      hint: "Consider memoization, lazy loading, and profiling",
      answer: "Use React.memo, useMemo, useCallback, code splitting with lazy loading, avoid unnecessary re-renders, and use React DevTools Profiler."
    }
  ];

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "border-success text-success";
      case "Medium": return "border-warning text-warning";
      case "Hard": return "border-destructive text-destructive";
      default: return "border-muted text-muted";
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Improve Your Resume Score</h2>
            <p className="text-muted-foreground text-lg">
              Section-wise suggestions to strengthen your resume
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="card-elevated hover:card-glow transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-primary text-primary">
                    Experience
                  </Badge>
                </div>
                <CardTitle className="text-lg">Add Measurable Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Quantify your impact with specific metrics and results:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use numbers: "Increased sales by 35%"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Show scale: "Managed team of 12 developers"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Highlight impact: "Reduced costs by $50K annually"</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-elevated hover:card-glow transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-secondary text-secondary">
                    Skills
                  </Badge>
                </div>
                <CardTitle className="text-lg">List Relevant Technical Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Optimize your skills section for better matches:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Include industry keywords and tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Group by category (Languages, Frameworks, Tools)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Prioritize in-demand technologies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-elevated hover:card-glow transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-accent text-accent">
                    Education
                  </Badge>
                </div>
                <CardTitle className="text-lg">Summarize Education Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Keep education clear and concise:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Include degree, major, and institution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Add relevant coursework or honors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>List certifications and licenses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-elevated hover:card-glow transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-success text-success">
                    Format
                  </Badge>
                </div>
                <CardTitle className="text-lg">Improve Document Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Make your resume easy to scan:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use bullet points for achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Keep consistent formatting and spacing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Limit to 1-2 pages maximum</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Practice Interview Questions</h3>
            <p className="text-muted-foreground mb-6">
              Prepare for common questions based on your target role
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id} className="card-elevated hover:card-glow transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                        <Badge variant="secondary">{q.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{q.question}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleQuestion(q.id)}
                      className="flex-shrink-0"
                    >
                      {expandedQuestion === q.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedQuestion === q.id && (
                  <CardContent className="space-y-4 animate-fade-in">
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm font-semibold">Hint:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{q.hint}</p>
                    </div>
                    
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-success">Sample Answer:</h4>
                      <p className="text-sm">{q.answer}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="default" className="flex-1">
                        Practice Answer
                      </Button>
                      <Button variant="outline">Mark as Done</Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Generate More Questions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterviewPrep;
