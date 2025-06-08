"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClipboardList, Star, BarChart3, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useEvaluations } from "@/lib/api/hooks";
import { DataTable } from "@/components/data-tables/data-table";
import { EvaluationDialog } from "@/components/dialogs/evaluation-dialog";
import { ScoreDialog } from "@/components/dialogs/score-dialog";
import { PartnerRatingDialog } from "@/components/dialogs/partner-rating-dialog";
import { evaluationColumns } from "@/components/columns/evaluation-columns";
import { scoreColumns } from "@/components/columns/score-columns";
import { partnerRatingColumns } from "@/components/columns/partner-rating-columns";

export default function ManageMonevPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("evaluations");
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [isPartnerRatingDialogOpen, setIsPartnerRatingDialogOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch evaluations data
  const { data: evaluationsData, isLoading: isEvaluationsLoading } =
    useEvaluations(currentPage, itemsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-6 mt-20">
        <div className="flex items-center justify-center h-64">
          <motion.div
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 mt-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold">Manajemen Monev</h1>
        <p className="text-muted-foreground">Manajemen Monev pada SIM MBKM</p>

        <Tabs
          defaultValue="evaluations"
          className="mt-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger
              value="evaluations"
              className="font-semibold data-[state=active]:bg-white data-[state=active]:border-blue-800 data-[state=active]:border-2 hover:bg-white/80"
            >
              Evaluasi
            </TabsTrigger>
            <TabsTrigger
              value="scores"
              className="font-semibold data-[state=active]:bg-white data-[state=active]:border-blue-800 data-[state=active]:border-2 hover:bg-white/80"
            >
              Nilai
            </TabsTrigger>
            <TabsTrigger
              value="ratings"
              className="font-semibold data-[state=active]:bg-white data-[state=active]:border-blue-800 data-[state=active]:border-2 hover:bg-white/80"
            >
              Rating Partner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evaluations" className="mt-4">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                    Kelola Evaluasi
                  </CardTitle>
                  <CardDescription>
                    Buat, perbarui, dan finalisasi evaluasi
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEvaluationDialogOpen(true)}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Evaluasi
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={evaluationColumns}
                  data={evaluationsData?.data || []}
                  isLoading={isEvaluationsLoading}
                  onEdit={(row) => {
                    // Handle edit
                    console.log("Edit evaluation", row);
                  }}
                  onDelete={(row) => {
                    // Handle delete
                    console.log("Delete evaluation", row);
                  }}
                  onFinalize={(row) => {
                    // Handle finalize
                    console.log("Finalize evaluation", row);
                  }}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {evaluationsData?.data?.length || 0} of{" "}
                  {evaluationsData?.total || 0} evaluations
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!evaluationsData?.next_page_url}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="scores" className="mt-4">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    Kelola Nilai
                  </CardTitle>
                  <CardDescription>
                    Kelola nilai berdasarkan evaluasi
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsScoreDialogOpen(true)}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Nilai
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={scoreColumns}
                  data={[]}
                  isLoading={false}
                  onEdit={(row) => {
                    // Handle edit
                    console.log("Edit score", row);
                  }}
                  onDelete={(row) => {
                    // Handle delete
                    console.log("Delete score", row);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="mt-4">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Kelola Rating Partner
                  </CardTitle>
                  <CardDescription>
                    Kelola rating aktivitas berdasarkan penilaian partner
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsPartnerRatingDialogOpen(true)}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Rating
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={partnerRatingColumns}
                  data={[]}
                  isLoading={false}
                  onEdit={(row) => {
                    // Handle edit
                    console.log("Edit rating", row);
                  }}
                  onDelete={(row) => {
                    // Handle delete
                    console.log("Delete rating", row);
                  }}
                  onPublish={(row) => {
                    // Handle publish
                    console.log("Publish rating", row);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <EvaluationDialog
        open={isEvaluationDialogOpen}
        onOpenChange={setIsEvaluationDialogOpen}
      />

      <ScoreDialog
        open={isScoreDialogOpen}
        onOpenChange={setIsScoreDialogOpen}
      />

      <PartnerRatingDialog
        open={isPartnerRatingDialogOpen}
        onOpenChange={setIsPartnerRatingDialogOpen}
      />
    </div>
  );
}
