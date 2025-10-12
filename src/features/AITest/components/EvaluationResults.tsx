"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface EvaluationResult {
  score: number; // Raw marks (e.g., 1 for correct, 0 for incorrect)
  feedback: string;
}

interface EvaluationResultsProps {
  evaluations: EvaluationResult[];
  totalScore: number; // Total raw marks
  maxPossibleScore?: number; // Maximum possible raw marks (e.g., 6 for 6 questions)
}

export function EvaluationResults({ 
  evaluations, 
  totalScore, 
  maxPossibleScore = 6 // Changed from 100 to 6 (or whatever makes sense for your use case)
}: EvaluationResultsProps) {
  
  // Convert raw score to percentage for styling
  const getScorePercentage = (score: number) => {
    return score * 100; // Since score is 0 or 1, this becomes 0% or 100%
  };

  const getScoreColor = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return "text-green-500 bg-green-500 border-green-500";
    if (percentage >= 50) return "text-yellow-500 bg-yellow-500 border-yellow-500";
    return "text-red-500 bg-red-500 border-red-500";
  };

  const getScoreVariant = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "warning";
    return "destructive";
  };

  const getScoreIcon = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (percentage >= 50) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const totalPercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  const totalColorClass = getScoreColor(totalScore);

  return (
    <div className="space-y-6 p-4">
      <Card className="bg-background/50 backdrop-blur-sm border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Evaluation Results</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Total Score:</span>
              <Badge 
                variant="secondary"
                className={`text-lg px-3 py-1 ${totalColorClass.split(' ')[0]} ${totalColorClass.split(' ')[1]}/10 border ${totalColorClass.split(' ')[2]}`}
              >
                {totalScore * 100}/{maxPossibleScore}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluations.map((evaluation, index) => {
              const scorePercentage = getScorePercentage(evaluation.score);
              const scoreVariant = getScoreVariant(evaluation.score);
              const colorClass = getScoreColor(evaluation.score);
              
              return (
                <div 
                  key={index} 
                  className="border-l-4 border-gray-200 pl-4 py-2"
                  role="listitem"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5" aria-hidden="true">
                      {getScoreIcon(evaluation.score)}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge variant={scoreVariant as any}>
                          {evaluation.score === 1 ? 'Passed' : 'Not Passed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.feedback}
                      </p>
                      <div className="space-y-1">
                        <div 
                          className="w-full bg-gray-100 rounded-full h-2"
                          role="progressbar"
                          aria-valuenow={scorePercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Question ${index + 1} score: ${scorePercentage}%`}
                        >
                          <div 
                            className={`h-full rounded-full ${colorClass.split(' ')[1]}`}
                            style={{ width: `${scorePercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Score</span>
                          <span className="text-xs font-medium">
                            {evaluation.score}/{1} {/* Show raw marks */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EvaluationResults;