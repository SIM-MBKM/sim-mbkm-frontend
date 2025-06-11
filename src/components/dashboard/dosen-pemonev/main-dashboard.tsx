"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  BookCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDosenPemonev } from "@/lib/api/providers/dosen-pemonev-provider";
import Link from "next/link";

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-3 w-3" />
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Evaluations Component
function RecentEvaluations() {
  const { evaluations, isLoading } = useDosenPemonev();

  const recentEvaluations = evaluations?.slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Recent Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Recent Evaluations
        </CardTitle>
        <Link href="/dashboard/dosen-pemonev/monev">
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentEvaluations.length > 0 ? (
          <div className="space-y-4">
            {recentEvaluations.map((evaluation) => (
              <motion.div
                key={evaluation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Evaluation #{evaluation.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">Student: {evaluation.mahasiswa_id.slice(-6)}</p>
                    {evaluation.registration_id && (
                      <p className="text-xs text-muted-foreground">
                        Registration: #{evaluation.registration_id.slice(-6)}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={`${getStatusColor(evaluation.status)} flex items-center gap-1`}>
                  {getStatusIcon(evaluation.status)}
                  {evaluation.status.replace("_", " ").toUpperCase()}
                </Badge>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No evaluations assigned yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DosenPemonevMainDashboard() {
  const { stats, isLoading } = useDosenPemonev();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dosen Pemonev Dashboard</h1>
            <p className="text-muted-foreground">Monitor and evaluate your assigned students</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assigned"
          value={stats.total}
          description="All evaluations assigned to you"
          icon={ClipboardList}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          description="Awaiting evaluation"
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          description="Currently being evaluated"
          icon={BookCheck}
          color="bg-orange-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          description="Finished evaluations"
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evaluation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion Rate</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.completed} of {stats.total} evaluations completed
              </p>
            </div>

            {stats.total > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Evaluations and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEvaluations />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/dosen-pemonev/monev">
              <Button className="w-full justify-start gap-2" variant="outline">
                <ClipboardList className="h-4 w-4" />
                Manage Evaluations
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>

            {stats.pending > 0 && (
              <Link href="/dashboard/dosen-pemonev/monev?status=pending">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Clock className="h-4 w-4" />
                  Review Pending Evaluations ({stats.pending})
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            )}

            {stats.inProgress > 0 && (
              <Link href="/dashboard/dosen-pemonev/monev?status=in_progress">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <BookCheck className="h-4 w-4" />
                  Continue In Progress ({stats.inProgress})
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Use the Manage Evaluations page to update scores and complete evaluations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      {!isLoading && stats.total === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Evaluations Assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any evaluations assigned to you yet. Check back later or contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
