"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  FileText,
  User,
  Mail,
  BookOpen,
  Award,
  Check,
  X,
  BookOpenCheck,
  FolderSync,
  Zap,
  Hash,
  LayoutGrid,
  School,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentPreview } from "./document-preview";
import { ParticleEffect } from "./particle-effect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Registration } from "@/lib/api/services/registration-service";

interface RegistrationCardProps {
  registration: Registration;
  isSelected: boolean;
  onToggleSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  isDisabled?: boolean;
}

export function RegistrationCard({
  registration,
  isSelected,
  onToggleSelect,
  onApprove,
  onReject,
  isDisabled = false,
}: RegistrationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState<string | null>(null);
  const [showApproveEffect, setShowApproveEffect] = useState(false);
  const [showRejectEffect, setShowRejectEffect] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  const handleApprove = () => {
    setShowApproveEffect(true);
    setTimeout(() => {
      onApprove();
      setShowApproveEffect(false);
    }, 800);
  };

  const handleReject = () => {
    setShowRejectEffect(true);
    setTimeout(() => {
      onReject();
      setShowRejectEffect(false);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      case "PENDING":
      default:
        return null;
    }
  };

  // Count total subjects
  const totalSubjects = (registration.equivalents?.length || 0) + (registration.matching?.length || 0);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const countUp = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative"
    >
      {showApproveEffect && <ParticleEffect type="approve" />}
      {showRejectEffect && <ParticleEffect type="reject" />}

      <Card
        className={`overflow-hidden border-2 transition-all ${
          registration.lo_validation === "APPROVED"
            ? "border-green-500/50 dark:border-green-700/50"
            : registration.lo_validation === "REJECTED"
            ? "border-red-500/50 dark:border-red-700/50"
            : isSelected
            ? "border-primary/50 dark:border-primary/50"
            : "border-neutral-200"
        }`}
      >
        <CardContent className="p-0">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect();
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <motion.h3
                      className="text-lg font-semibold"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {registration.activity_name}
                    </motion.h3>
                    <Badge variant="outline" className={getStatusColor(registration.lo_validation)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(registration.lo_validation)}
                        {registration.lo_validation}
                      </span>
                    </Badge>
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground"
                    variants={countUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="flex items-center gap-1" variants={countUp}>
                      <User className="h-3.5 w-3.5" />
                      <span>{registration.user_name || registration.user_nrp}</span>
                    </motion.div>
                    <motion.div className="flex items-center gap-1" variants={countUp}>
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Semester {registration.semester}</span>
                    </motion.div>
                    <motion.div className="flex items-center gap-1" variants={countUp}>
                      <Award className="h-3.5 w-3.5" />
                      <span>{registration.total_sks} SKS</span>
                    </motion.div>
                    {totalSubjects > 0 && (
                      <motion.div className="flex items-center gap-1 text-primary" variants={countUp}>
                        <BookOpenCheck className="h-3.5 w-3.5" />
                        <span>{totalSubjects} Courses</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {registration.lo_validation === "PENDING" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 bg-red-100 hover:bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      onClick={handleReject}
                      disabled={isDisabled}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 bg-green-100 hover:bg-green-200 text-green-800 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                      onClick={handleApprove}
                      disabled={isDisabled}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpanded(!expanded)}
                  className="h-8 w-8 transition-all duration-300"
                >
                  <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden border-t"
              >
                <div className="p-4 md:p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4 w-full justify-start bg-muted/50">
                      <TabsTrigger value="info" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Info</span>
                      </TabsTrigger>
                      <TabsTrigger value="documents" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Documents</span>
                      </TabsTrigger>
                      {registration.matching && registration.matching.length > 0 && (
                        <TabsTrigger value="matching" className="flex items-center gap-1">
                          <FolderSync className="h-4 w-4" />
                          <span>Matching</span>
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            {registration.matching.length}
                          </Badge>
                        </TabsTrigger>
                      )}
                      {registration.equivalents && registration.equivalents.length > 0 && (
                        <TabsTrigger value="equivalents" className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          <span>Equivalents</span>
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            {registration.equivalents.length}
                          </Badge>
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="info" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                            Advisor Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <User className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{registration.academic_advisor}</p>
                                <p className="text-sm text-muted-foreground">Academic Advisor</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{registration.academic_advisor_email}</p>
                                <p className="text-sm text-muted-foreground">Advisor Email</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground pt-2">
                            Mentor Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <User className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{registration.mentor_name}</p>
                                <p className="text-sm text-muted-foreground">Mentor Name</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{registration.mentor_email}</p>
                                <p className="text-sm text-muted-foreground">Mentor Email</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground pt-2">
                              Additional Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="p-3 rounded-lg border bg-background/50">
                                <p className="text-sm text-muted-foreground">Student NRP</p>
                                <p className="font-medium">{registration.user_nrp}</p>
                              </div>
                              <div className="p-3 rounded-lg border bg-background/50">
                                <p className="text-sm text-muted-foreground">Advisor Validation</p>
                                <p className="font-medium">{registration.lo_validation}</p>
                              </div>
                              <div className="p-3 rounded-lg border bg-background/50">
                                <p className="text-sm text-muted-foreground">Activity Name</p>
                                <p className="font-medium truncate">{registration.activity_name}</p>
                              </div>
                              <div className="p-3 rounded-lg border bg-background/50">
                                <p className="text-sm text-muted-foreground">Advising Confirmed</p>
                                <p className="font-medium">{registration.advising_confirmation ? "Yes" : "No"}</p>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center gap-2 text-primary font-medium mb-2">
                              <LayoutGrid className="h-5 w-5" />
                              <h4>Course Overview</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="h-7 px-2 bg-blue-50 text-blue-700 border-blue-200">
                                  <FolderSync className="h-3.5 w-3.5 mr-1" />
                                  {registration.matching?.length || 0}
                                </Badge>
                                <span className="text-sm">Matching</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="h-7 px-2 bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  <Zap className="h-3.5 w-3.5 mr-1" />
                                  {registration.equivalents?.length || 0}
                                </Badge>
                                <span className="text-sm">Equivalents</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                      >
                        {registration.documents.map((doc: any, index: any) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 cursor-pointer"
                            onClick={() => setShowDocumentPreview(doc.file_storage_id)}
                          >
                            <div className="p-2 rounded-md bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              View
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>

                    {registration.matching && registration.matching.length > 0 && (
                      <TabsContent value="matching" className="space-y-4">
                        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FolderSync className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium">Matched Courses</h4>
                            </div>
                            <Badge className="bg-blue-500/80">{registration.matching.length} courses</Badge>
                          </div>

                          <div className="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 mb-4">
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <School className="h-3.5 w-3.5 text-blue-600" />
                              <span>About Matching Courses</span>
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Matching courses are subjects that have been matched with the student&apos;s MBKM program
                              activities. These matches are based on curriculum alignment and learning outcomes.
                            </p>
                          </div>

                          <div className="grid gap-4">
                            {registration.matching.map((item: any, index: any) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative overflow-hidden p-4 rounded-lg border bg-white dark:bg-gray-900"
                              >
                                {/* Decorative gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50 dark:from-blue-950/20 dark:to-indigo-950/20"></div>

                                {/* Content */}
                                <div className="relative">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h5 className="font-semibold flex items-center gap-2">
                                        <span>{item.mata_kuliah}</span>
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:border-blue-700"
                                        >
                                          {item.sks} SKS
                                        </Badge>
                                      </h5>
                                      <div className="mt-1 flex items-center gap-3">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <Hash className="h-3.5 w-3.5" />
                                          <span className="font-medium">{item.kode}</span>
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
                                          {typeof item.semester === "string"
                                            ? item.semester
                                            : `Semester ${item.semester}`}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {item.documents?.length > 0 ? (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() =>
                                                  item.documents?.length &&
                                                  setShowDocumentPreview(item.documents[0].file_storage_id)
                                                }
                                              >
                                                <FileText className="h-4 w-4 mr-1" />
                                                View Document
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{item.documents[0].name}</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">No documents</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2 text-sm border-t pt-3">
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Department</h6>
                                      <p className="font-medium truncate">{item.departemen}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Course Type</h6>
                                      <p className="font-medium">{item.tipe_mata_kuliah}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Class</h6>
                                      <p className="font-medium">{item.kelas}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Provider</h6>
                                      <p className="font-medium truncate">{item.prodi_penyelenggara}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </TabsContent>
                    )}

                    {registration.equivalents && registration.equivalents.length > 0 && (
                      <TabsContent value="equivalents" className="space-y-4">
                        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-purple-500" />
                              <h4 className="font-medium">Equivalent Courses</h4>
                            </div>
                            <Badge className="bg-purple-500/80">{registration.equivalents.length} courses</Badge>
                          </div>

                          <div className="bg-purple-50/30 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30 mb-4">
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <School className="h-3.5 w-3.5 text-purple-600" />
                              <span>About Equivalent Courses</span>
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Equivalent courses are recognized as equal to specific courses in the ITS curriculum.
                              Credits earned in these courses will be automatically transferred to the student&apos;s
                              academic record.
                            </p>
                          </div>

                          <div className="grid gap-4">
                            {registration.equivalents.map((item: any, index: any) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative overflow-hidden p-4 rounded-lg border bg-white dark:bg-gray-900"
                              >
                                {/* Decorative gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-fuchsia-50 opacity-50 dark:from-purple-950/20 dark:to-fuchsia-950/20"></div>

                                {/* Content */}
                                <div className="relative">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h5 className="font-semibold flex items-center gap-2">
                                        <span>{item.mata_kuliah}</span>
                                        <Badge
                                          variant="outline"
                                          className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:border-purple-700"
                                        >
                                          {item.sks} SKS
                                        </Badge>
                                      </h5>
                                      <div className="mt-1 flex items-center gap-3">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                          <Hash className="h-3.5 w-3.5" />
                                          <span className="font-medium">{item.kode}</span>
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
                                          {typeof item.semester === "string"
                                            ? item.semester
                                            : `Semester ${item.semester}`}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {item.documents?.length > 0 ? (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                                onClick={() =>
                                                  item.documents?.length &&
                                                  setShowDocumentPreview(item.documents[0].file_storage_id)
                                                }
                                              >
                                                <FileText className="h-4 w-4 mr-1" />
                                                View Document
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{item.documents[0].name}</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">No documents</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2 text-sm border-t pt-3">
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Department</h6>
                                      <p className="font-medium truncate">{item.departemen}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Course Type</h6>
                                      <p className="font-medium">{item.tipe_mata_kuliah}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Class</h6>
                                      <p className="font-medium">{item.kelas}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <h6 className="text-xs text-muted-foreground">Provider</h6>
                                      <p className="font-medium truncate">{item.prodi_penyelenggara}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showDocumentPreview && (
          <DocumentPreview documentId={showDocumentPreview} onClose={() => setShowDocumentPreview(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
