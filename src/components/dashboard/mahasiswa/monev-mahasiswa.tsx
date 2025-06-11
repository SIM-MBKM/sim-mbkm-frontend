"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  BookCheck,
  AlertTriangle,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Star,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEvaluationsByMahasiswaMe, useEvaluationById } from "@/lib/api/hooks";
import type { EvaluationList, Evaluation } from "@/lib/api/services/monev-service";

// Types
type MahasiswaMonevStats = {
  total: number;
  completed: number;
};

type MahasiswaMonevContextType = {
  evaluations: EvaluationList[] | undefined;
  isLoading: boolean;
  stats: MahasiswaMonevStats;
  expandedCard: string | null;
  setExpandedCard: (id: string | null) => void;
  selectedEvaluation: Evaluation | undefined;
  isLoadingDetails: boolean;
};

// Context
const MahasiswaMonevContext = createContext<MahasiswaMonevContextType | undefined>(undefined);

function useMahasiswaMonev() {
  const context = useContext(MahasiswaMonevContext);
  if (context === undefined) {
    throw new Error("useMahasiswaMonev must be used within a MahasiswaMonevProvider");
  }
  return context;
}

// Provider
function MahasiswaMonevProvider({ children }: { children: React.ReactNode }) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { data: evaluationsData, isLoading: isEvaluationsLoading } = useEvaluationsByMahasiswaMe(1, 50); // Get more records for simplicity

  const { data: selectedEvaluationData, isLoading: isLoadingDetails } = useEvaluationById(expandedCard || undefined);

  const evaluations = evaluationsData?.data || [];

  // Calculate simple stats
  const stats = useMemo<MahasiswaMonevStats>(() => {
    if (!evaluations) {
      return { total: 0, completed: 0 };
    }

    const total = evaluations.length;
    const completed = evaluations.filter((evaluation) => evaluation.status === "completed").length;

    return { total, completed };
  }, [evaluations]);

  const value = {
    evaluations,
    isLoading: isEvaluationsLoading,
    stats,
    expandedCard,
    setExpandedCard,
    selectedEvaluation: selectedEvaluationData?.data,
    isLoadingDetails,
  };

  return <MahasiswaMonevContext.Provider value={value}>{children}</MahasiswaMonevContext.Provider>;
}

// Simple Stats Header
function StatsHeader() {
  const { stats } = useMahasiswaMonev();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">Total Evaluations</div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-700">Completed</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Expandable Evaluation Card
function EvaluationCard({ evaluation }: { evaluation: EvaluationList }) {
  const { expandedCard, setExpandedCard, selectedEvaluation, isLoadingDetails } = useMahasiswaMonev();
  const isExpanded = expandedCard === evaluation.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <BookCheck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A-") return "text-green-600 bg-green-50 border-green-200";
    if (grade === "B+" || grade === "B" || grade === "B-") return "text-blue-600 bg-blue-50 border-blue-200";
    if (grade === "C+" || grade === "C" || grade === "C-") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setExpandedCard(null);
    } else {
      setExpandedCard(evaluation.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
        <CardContent className="p-6">
          {/* Main Card Content */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Evaluation #{evaluation.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">Evaluator: {evaluation.dosen_pemonev_id.slice(-6)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(evaluation.status)} flex items-center gap-1 border`}>
                {getStatusIcon(evaluation.status)}
                {evaluation.status.replace("_", " ").toUpperCase()}
              </Badge>

              <Button variant="ghost" size="sm" onClick={handleToggleExpand} className="p-2">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Registration Info */}
          {evaluation.registration_id && (
            <div className="text-sm text-gray-600 mb-4">Registration: #{evaluation.registration_id.slice(-6)}</div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {evaluation.status === "completed" ? "100%" : evaluation.status === "in_progress" ? "50%" : "0%"}
              </span>
            </div>
            <Progress
              value={evaluation.status === "completed" ? 100 : evaluation.status === "in_progress" ? 50 : 0}
              className="h-2"
            />
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2">
            {evaluation.status === "completed" && (
              <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            )}
          </div> */}

          {/* Expanded Content - Scores */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200 overflow-hidden"
              >
                {isLoadingDetails ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ) : selectedEvaluation && selectedEvaluation.scores && selectedEvaluation.scores.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      Your Scores
                    </h4>

                    <div className="grid gap-3">
                      {selectedEvaluation.scores.map((score, index) => (
                        <div key={score.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">Subject {index + 1}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-gray-900">{score.score || "N/A"}</span>
                              <Badge className={`${getGradeColor(score.grade_letter)} border font-medium`}>
                                {score.grade_letter || "N/A"}
                              </Badge>
                            </div>
                          </div>

                          {score.score && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${score.score}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Average Score */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-900">Average Score</span>
                        <span className="text-xl font-bold text-blue-600">
                          {selectedEvaluation.scores.reduce((acc, score) => acc + (score.score || 0), 0) /
                            selectedEvaluation.scores.length}
                          /100
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ClipboardList className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">No scores available yet</p>
                    <p className="text-gray-500 text-sm">Your evaluation is still in progress</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main Components
export function MahasiswaMonevLayout({ children }: { children: React.ReactNode }) {
  return <MahasiswaMonevProvider>{children}</MahasiswaMonevProvider>;
}

export function MahasiswaMonevMainDashboard() {
  const { evaluations, isLoading, stats } = useMahasiswaMonev();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Evaluations</h1>
            <p className="text-gray-600">View your academic evaluation progress and scores</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <StatsHeader />

      {/* Evaluations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : evaluations && evaluations.length > 0 ? (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <EvaluationCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 bg-white">
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No Evaluations Yet</h3>
            <p className="text-gray-600">
              You don't have any evaluations assigned yet. Once your supervisor assigns evaluations, they will appear
              here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// For the monev page, we can just use the same component
export function MahasiswaMonevPage() {
  return <MahasiswaMonevMainDashboard />;
}
