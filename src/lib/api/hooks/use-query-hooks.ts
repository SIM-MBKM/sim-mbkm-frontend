import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activityService,
  authService,
  matchingService,
  monitoringService,
  registrationService,
  userService,
  type LoginCredentials,
  type LogoutCredentials,
  type UserUpdateInput,
  type ActivityCreateInput,
  type LogbookInput,
  type RegisterInput,
  type TranscriptInput,
  SyllabusInput,
  ReportInput,
  EquivalentInput,
  RegistrationUpdateRequest,
  SubjectFilterRequest,
  ApprovalInput,
  RegistrationFilter,
  ReportApprovalInput,
  TranscriptByAdvisorInput,
  SyllabusByAdvisorInput,
  ReportScheduleByAdvisorInput,
  ActivityFilter,
  ActivityAllResponse,
  ActivityUpdateInput,
  SubjectFilter,
  MatchingInput,
  SubjectInput,
  PaginatedResponse,
  User,
  UserFilter,
  Role,
  BaseResponse,
  UserAlt,
} from "../services";
import {
  reportService,
  type CreateReportRequest,
  type UpdateReportRequest,
  type ScheduleReportRequest,
  type ExportReportRequest,
  type ReportFilters,
  type ReportResultFilters,
  type PaginationParams,
  type ApiResponse,
  type ReportListItem,
  type Report,
  type ReportResult,
  type ReportResultListItem,
  type PaginatedResponse as PaginatedResponseReport,
  type ReportExport,
  type DownloadResponse,
} from "../services/report-service";
import { fileService } from "../services/file-service";
import { notificationService } from "../services/notification-service";
import { brokerService } from "../services/broker-service";
import {
  EvaluationCreateInput,
  EvaluationDelete,
  EvaluationFinalize,
  EvaluationScoreUpdateInput,
  EvaluationUpdateInput,
  monevService,
  PartnerRatingCreateInput,
  PartnerRatingPublish,
} from "../services/monev-service";
import { string } from "zod";
import { UserRole } from "../services";

// AUTH HOOKS

export const useIdentityCheck = () => {
  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return authService.identityCheck({ email });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useOAuthRedirect = () => {
  const mutation = useMutation({
    mutationFn: async ({ provider }: { provider: "google" | "sso" }) => {
      const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

      const endpoints = {
        google: `${authServiceUrl}/auth/google/redirect`,
        sso: `${authServiceUrl}/auth/its/redirect`,
      };

      window.location.href = endpoints[provider];

      return new Promise(() => {});
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// export const useSignup = () => {
//   const mutation = useMutation({
//     mutationFn: (userData: SignupCredentials) =>
//       authService.signup(userData),
//   });

//   return {
//     ...mutation,
//     isLoading: mutation.isPending
//   };
// };

export const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentials: LogoutCredentials) => authService.logout(credentials),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// USER HOOKS

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => userService.getCurrentUser(),
    retry: 1,
  });
};

export const useUserRole = () => {
  return useQuery({
    queryKey: ["userRole"],
    queryFn: () => userService.getUserRole(),
    staleTime: 5 * 60 * 1000, // 5min
    retry: 1,
  });
};

export const useGetUserDatas = () => {
  return useQuery({
    queryKey: ["userDatas"],
    queryFn: () => userService.getUserDatas(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UserUpdateInput }) =>
      userService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["user", variables.userId], data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Failed to update");
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUsers = (page = 1, perPage = 10, filters: UserFilter = {}) => {
  return useQuery<PaginatedResponse<UserAlt>, Error>({
    queryKey: ["users", page, perPage, filters],
    queryFn: () => userService.getAllUsers(page, perPage, filters),
    staleTime: 2 * 60 * 1000, // 2min
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoles = () => {
  return useQuery<BaseResponse<Role[]>, Error>({
    queryKey: ["roles"],
    queryFn: () => userService.getAllRoles(),
    staleTime: 10 * 60 * 1000, // Rarely changes -- for future dev
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      userService.updateUserRoleByUserId(userId, role),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
    },
  });

  // Return the mutation object so we can access its properties
  return mutation;
};

// ACTIVITY HOOKS

export const useGetTotalMatchedStatusActivities = () => {
  return useQuery({
    queryKey: ["totalMatchedStatusActivities", "activities"],
    queryFn: () => activityService.getTotalMatchedStatusActivities(),
  });
};

export const useGetAcademicYears = () => {
  return useQuery({
    queryKey: ["academicYears"],
    queryFn: () => activityService.getAcademicYears(),
  });
};

export const useAllProgramTypes = () => {
  return useQuery({
    queryKey: ["program_types"], // Add token to query key
    queryFn: () => activityService.getAllProgramTypes(),
  });
};

export const useAllLevels = () => {
  return useQuery({
    queryKey: ["levels"], // Add token to query key
    queryFn: () => activityService.getAllLevels(),
  });
};

export const useAllGroups = () => {
  return useQuery({
    queryKey: ["groups"], // Add token to query key
    queryFn: () => activityService.getAllGroups(),
  });
};

export const useActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ["activities", page, limit, filters],
    queryFn: () => activityService.getActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useUnmatchedActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ["activities", "unmatched", page, limit, filters],
    queryFn: () => activityService.getUnmatchedActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useMatchedActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ["activities", "matched", page, limit, filters],
    queryFn: () => activityService.getMatchedActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useUpdateActivityById = (id: string, activityData: ActivityUpdateInput) => {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => activityService.updateActivityById(id, activityData),
  });
};

export const useActivityById = (id?: string) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityService.getActivityById(id!),
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (activityData: ActivityCreateInput) => activityService.createActivity(activityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, activityData }: { id: string; activityData: Partial<ActivityCreateInput> }) =>
      activityService.updateActivity(id, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", variables.id] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpcomingActivities = () => {
  return useQuery({
    queryKey: ["activities", "upcoming"],
    queryFn: () => activityService.getUpcomingActivities(),
  });
};

// REGISTRATION HOOKS
export const useRegistrations = ({
  page = 1,
  limit = 10,
  filter,
}: {
  page: number;
  limit: number;
  filter: RegistrationFilter;
}) => {
  return useQuery({
    queryKey: ["registrations"],
    queryFn: () => registrationService.getAllRegistrations({ page, limit, filter }),
  });
};

export const useCheckEligibility = (activity_id: string) => {
  return useQuery({
    queryKey: ["checkEligibility", activity_id],
    queryFn: () => registrationService.checkEligibility(activity_id),
  });
};

export const useApproveStudentRegistrations = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (approvalInput: ApprovalInput) => registrationService.approveStudentRegistrations(approvalInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRegistrations"] });
    },
    onError: (error) => {
      console.error("Error approving student registrations:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useRegistrationAdvisor = ({
  page,
  limit,
  filter,
}: {
  page: number;
  limit: number;
  filter: RegistrationFilter;
}) => {
  return useQuery({
    queryKey: ["userRegistrations", page, limit, filter],
    queryFn: () => registrationService.getRegistrationAdvisor({ page, limit, filter }),
  });
};

export const useRegistrationLOMBKM = ({
  page,
  limit,
  filter,
}: {
  page: number;
  limit: number;
  filter: RegistrationFilter;
}) => {
  return useQuery({
    queryKey: ["userRegistrations", page, limit, filter],
    queryFn: () => registrationService.getRegistrationLOMBKM({ page, limit, filter }),
  });
};

export const useRegistrationStudentMatching = () => {
  return useQuery({
    queryKey: ["registrationStudentMatching"],
    queryFn: () => registrationService.getRegistrationStudentMatching(),
  });
};

export const useRegisterForProgram = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (registrationData: RegisterInput) => registrationService.registerForProgram(registrationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRegistrations"] });
    },
    onError: (error) => {
      console.error("Error registering for program:", error);
    },
  });

  // Add isLoading property for backward compatibility
  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUserRegistrations = () => {
  return useQuery({
    queryKey: ["userRegistrations"],
    queryFn: () => registrationService.getUserRegistrations(),
  });
};

export const useRegistrationTranscriptsByStudent = () => {
  return useQuery({
    queryKey: ["registrationTranscriptsByStudent"],
    queryFn: () => registrationService.getRegistrationTranscriptsByStudent(),
  });
};

export const useRegistrationSyllabusesByStudent = () => {
  return useQuery({
    queryKey: ["registrationSyllabusesByStudent"],
    queryFn: () => registrationService.getRegistrationSyllabusesByStudent(),
  });
};

export const useStudentRegistrations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["registrationStudentMatching", page, limit],
    queryFn: () => registrationService.getRegistrationByStudent(page, limit),
  });
};

export const useUpdateRegistrationStudentById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, registrationInput }: { id: string; registrationInput: RegistrationUpdateRequest }) =>
      registrationService.updateRegistrationStudentById(id, registrationInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationStudentMatching"],
      });
    },
    onError: (error) => {
      console.error("Error submitting transcripts:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useFilterSubject = ({
  limit,
  page,
  filter,
}: {
  limit: number;
  page: number;
  filter: SubjectFilterRequest;
}) => {
  return useQuery({
    queryKey: ["filterSubject", filter, limit, page],
    queryFn: () => matchingService.getFilterSubject({ limit, page, filter }),
  });
};

// MONITORING HOOKS

export const useReportSchedulesByAdvisor = ({
  page,
  limit,
  input,
}: {
  page: number;
  limit: number;
  input: ReportScheduleByAdvisorInput;
}) => {
  return useQuery({
    queryKey: ["reportSchedulesByAdvisor", page, limit, input],
    queryFn: () => monitoringService.getReportSchedulesByAdvisor({ page, limit, input }),
  });
};

export const useTranscriptsByAdvisor = ({
  page,
  limit,
  transcriptByAdvisorInput,
}: {
  page: number;
  limit: number;
  transcriptByAdvisorInput: TranscriptByAdvisorInput;
}) => {
  return useQuery({
    queryKey: ["transcriptsByAdvisor", page, limit, transcriptByAdvisorInput],
    queryFn: () =>
      monitoringService.getTranscriptsByAdvisor({
        page,
        limit,
        transcriptByAdvisorInput,
      }),
  });
};

export const useSyllabusesByAdvisor = ({
  page,
  limit,
  syllabusByAdvisorInput,
}: {
  page: number;
  limit: number;
  syllabusByAdvisorInput: SyllabusByAdvisorInput;
}) => {
  return useQuery({
    queryKey: ["syllabusesByAdvisor", page, limit, syllabusByAdvisorInput],
    queryFn: () =>
      monitoringService.getSyllabusesByAdvisor({
        page,
        limit,
        syllabusByAdvisorInput,
      }),
  });
};

export const useReportsApproval = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reportApprovalInput: ReportApprovalInput) => monitoringService.reportsApproval(reportApprovalInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportSchedulesByAdvisor"] });
    },
    onError: (error) => {
      console.error("Error approving reports:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubmitTranscript = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (transcriptInput: TranscriptInput) => monitoringService.submitTranscript(transcriptInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationTranscriptsByStudent"],
      });
    },
    onError: (error) => {
      console.error("Error submitting transcripts:", error);
    },
  });

  // Add isLoading property for backward compatibility
  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubmitSyllabus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (syllabusInput: SyllabusInput) => monitoringService.submitSyllabus(syllabusInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationSyllabusesByStudent"],
      });
    },
    onError: (error) => {
      console.error("Error submitting syllabus", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteTranscript = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => monitoringService.deleteTranscript(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationTranscriptsByStudent"],
      });
    },
    onError: (error) => {
      console.error("Error deleting transcript:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteSyllabus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => monitoringService.deleteSyllabus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationSyllabusesByStudent"],
      });
    },
    onError: (error) => {
      console.error("Error deleting syllabus:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useReportSchedulesByStudent = () => {
  return useQuery({
    queryKey: ["reportSchedulesByStudent"],
    queryFn: () => monitoringService.getReportSchedulesByStudent(),
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reportInput: ReportInput) => monitoringService.submitReport(reportInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportSchedulesByStudent"] });
    },
    onError: (error) => {
      console.error("Error submitting report", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};
export const useTranscriptsByStudent = () => {
  return useQuery({
    queryKey: ["transcriptsByStudent"],
    queryFn: () => monitoringService.getTranscriptsByStudent(),
  });
};

export const useUserLogbooks = (programId?: string) => {
  return useQuery({
    queryKey: ["logbooks", programId],
    queryFn: () => monitoringService.getUserLogbooks(programId),
  });
};

export const useLogbookById = (id?: string) => {
  return useQuery({
    queryKey: ["logbook", id],
    queryFn: () => monitoringService.getLogbookById(id!),
    enabled: !!id,
  });
};

export const useSubmitLogbook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (logbookData: LogbookInput) => monitoringService.submitLogbook(logbookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["logbooks", variables.programId],
      });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateLogbook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, logbookData }: { id: string; logbookData: Partial<LogbookInput> }) =>
      monitoringService.updateLogbook(id, logbookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["logbooks"] });
      queryClient.invalidateQueries({ queryKey: ["logbook", variables.id] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useMonitoringSessions = (programId?: string) => {
  return useQuery({
    queryKey: ["monitoringSessions", programId],
    queryFn: () => monitoringService.getMonitoringSessions(programId),
  });
};

// MATCHING HOOKS

export const useSubmitEquivalenceRequest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (equivalentInput: EquivalentInput) => matchingService.submitEquivalents(equivalentInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrationStudentMatching"],
      });
    },
    onError: (error) => {
      console.error("Error submitting equivalent ", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubmitSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (subjectInput: SubjectInput) => matchingService.submitSubjects(subjectInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "activities"] });
    },
    onError: (error) => {
      console.error("Error submitting subject:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, subjectInput }: { id: string; subjectInput: SubjectInput }) =>
      matchingService.updateSubjects(id, subjectInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "activities"] });
    },
    onError: (error) => {
      console.error("Error updating subject:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (subjectId: string) => matchingService.deleteSubject(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "activities"] });
    },
    onError: (error) => {
      console.error("Error deleting subject:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubmitMatchingRequest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (matchingInput: MatchingInput) => {
      console.log("Submitting matching request with input:", matchingInput);
      const response = await matchingService.submitMatchings(matchingInput);
      console.log("Matching request response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("Matching request successful:", data);
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({
        queryKey: ["totalMatchedStatusActivities"],
      });
    },
    onError: (error) => {
      console.error("Error submitting matching:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubjects = ({
  page,
  limit,
  subjectFilter,
}: {
  page: number;
  limit: number;
  subjectFilter: SubjectFilter;
}) => {
  return useQuery({
    queryKey: ["subjects", "activities", page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjects({ page, limit, subjectFilter }),
  });
};

export const useSubjectsGeofisika = ({
  page,
  limit,
  subjectFilter,
}: {
  page: number;
  limit: number;
  subjectFilter: SubjectFilter;
}) => {
  return useQuery({
    queryKey: ["subjects", "activities", page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjectsGeofisika({ page, limit, subjectFilter }),
  });
};

export const useSubjectsNonGeofisika = ({
  page,
  limit,
  subjectFilter,
}: {
  page: number;
  limit: number;
  subjectFilter: SubjectFilter;
}) => {
  return useQuery({
    queryKey: ["subjects", "activities", page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjectsNonGeofisika({ page, limit, subjectFilter }),
  });
};

export const useTotalSubjects = () => {
  return useQuery({
    queryKey: ["totalSubjects", "activities", "subjects"],
    queryFn: () => matchingService.getTotalSubjects(),
  });
};

// FILE HOOKS
export const useGetTemporaryLink = (fileId: string) => {
  return useQuery({
    queryKey: ["temporaryLink", fileId],
    queryFn: () => fileService.GCSGetTemporaryLink(fileId),
    enabled: !!fileId && fileId.trim() !== "", // Only run the query if fileId is not empty
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// NOTIFICATION HOOKS
export const useGetAllNotifications = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationService.getAllNotifications(page, limit),
  });
};

export const useGetNotificationByID = (id: string) => {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: () => notificationService.getNotificationByID(id),
  });
};

export const useGetNotificationBySenderEmail = (senderEmail: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["notifications", "sender", senderEmail, page, limit],
    queryFn: () => notificationService.getNotificationBySenderEmail(senderEmail, page, limit),
  });
};

export const useGetNotificationByReceiverEmail = (receiverEmail: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["notifications", "receiver", receiverEmail, page, limit],
    queryFn: () => notificationService.getNotificationByReceiverEmail(receiverEmail, page, limit),
  });
};

// BROKER HOOKS
export const useGetStatisticDashboardDosenPembimbing = () => {
  return useQuery({
    queryKey: ["statisticDashboardDosenPembimbing"],
    queryFn: () => brokerService.getStatisticDashboardDosenPembimbing(),
  });
};

// MONEV HOOKS

export const useSubmitEvaluation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (evaluationInput: EvaluationCreateInput) => monevService.submitEvaluation(evaluationInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
    onError: (error) => {
      console.error("Error submitting evaluation:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (evaluationInput: EvaluationUpdateInput) => monevService.updateEvaluation(evaluationInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", variables.id] });
    },
    onError: (error) => {
      console.error("Error updating evaluation:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useEvaluationById = (id?: string) => {
  return useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => monevService.getEvaluationById(id!),
    enabled: !!id,
  });
};

export const useEvaluationsByPemonevMe = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["evaluations", page, perPage],
    queryFn: () => monevService.getEvaluationsByPemonevMe(page, perPage),
    staleTime: 5000, // 5 seconds
  });
};

export const useEvaluationsByMahasiswaMe = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["evaluations", page, perPage],
    queryFn: () => monevService.getEvaluationsByMahasiswaMe(page, perPage),
    staleTime: 5000, // 5 seconds
  });
};

export const useEvaluations = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["evaluations", page, perPage],
    queryFn: () => monevService.getEvaluations(page, perPage),
    staleTime: 5000, // 5 seconds
  });
};

export const useFinalizeEvaluation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (evaluationFinalize: EvaluationFinalize) => monevService.finalizeEvaluation(evaluationFinalize),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", variables.id] });
    },
    onError: (error) => {
      console.error("Error finalizing evaluation:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (evaluationDelete: EvaluationDelete) => monevService.deleteEvaluation(evaluationDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
    onError: (error) => {
      console.error("Error deleting evaluation:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateEvaluationScore = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (scoreInput: EvaluationScoreUpdateInput) => monevService.updateEvaluationScore(scoreInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({
        queryKey: ["evaluation", variables.evaluation_id],
      });
    },
    onError: (error) => {
      console.error("Error updating evaluation score:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useSubmitPartnerRating = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (ratingInput: PartnerRatingCreateInput) => monevService.submitPartnerRating(ratingInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerRatings"] });
    },
    onError: (error) => {
      console.error("Error submitting partner rating:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const usePartnerRatingById = (id?: string) => {
  return useQuery({
    queryKey: ["partnerRating", id],
    queryFn: () => monevService.getPartnerRatingById(id!),
    enabled: !!id,
  });
};

export const usePublishPartnerRating = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (ratingPublish: PartnerRatingPublish) => monevService.publishPartnerRating(ratingPublish),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partnerRatings"] });
      queryClient.invalidateQueries({
        queryKey: ["partnerRating", variables.id],
      });
    },
    onError: (error) => {
      console.error("Error publishing partner rating:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const userPartnerRatings = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["partnerRatings", page, perPage],
    queryFn: () => monevService.getPartnerRatings(page, perPage),
    staleTime: 5000, // 5 seconds
  });
};

export const useUsersByRole = (role: "mahasiswa" | "dosen_pemonev" | "dosen_pembimbing") => {
  return useQuery({
    queryKey: ["users", "role", role],
    queryFn: () => userService.getUsersByRole(role),
    staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
  });
};

export const useMahasiswaUsers = () => {
  return useQuery({
    queryKey: ["users", "mahasiswa"],
    queryFn: () => userService.getUsersByRole("MAHASISWA"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMahasiswaUsersAlt = () => {
  return useQuery({
    queryKey: ["users", "mahasiswa"],
    queryFn: () => userService.getUsersByRoleAlt("MAHASISWA"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDosenPemonevUsers = () => {
  return useQuery({
    queryKey: ["users", "dosen_pemonev"],
    queryFn: () => userService.getUsersByRole("DOSEN PEMONEV"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDosenPemonevUsersAlt = () => {
  return useQuery({
    queryKey: ["users", "dosen_pemonev"],
    queryFn: () => userService.getUsersByRoleAlt("DOSEN PEMONEV"),
  });
};

export const useDosenPembimbingUsers = () => {
  return useQuery({
    queryKey: ["users", "dosen_pembimbing"],
    queryFn: () => userService.getUsersByRole("DOSEN PEMBIMBING"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDosenPembimbingUsersAlt = () => {
  return useQuery({
    queryKey: ["users", "dosen_pembimbing"],
    queryFn: () => userService.getUsersByRoleAlt("DOSEN PEMBIMBING"),
    staleTime: 5 * 60 * 1000,
  });
};

export const useChangeSelfRoleToDosenPembimbing = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => userService.updateUserRoleSelfToDosenPembimbing(),
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
    },
  });

  // Return the mutation object so we can access its properties
  return mutation;
};

export const useChangeSelfRoleToDosenPemonev = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => userService.updateUserRoleSelfToDosenPemonev(),
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
    },
  });

  // Return the mutation object so we can access its properties
  return mutation;
};

// REPORT HOOKS
export const useReports = (params?: ReportFilters & PaginationParams) => {
  return useQuery<PaginatedResponseReport<ReportListItem>, Error>({
    queryKey: ["reports", params?.page || 1, params?.per_page || 10, params?.name, params?.is_scheduled],
    queryFn: () => reportService.getReports(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReport = (id?: string) => {
  return useQuery<ApiResponse<Report>, Error>({
    queryKey: ["report", id],
    queryFn: () => reportService.getReport(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReportResults = (reportId?: string, params?: ReportResultFilters & PaginationParams) => {
  return useQuery<PaginatedResponseReport<ReportResultListItem>, Error>({
    queryKey: [
      "reportResults",
      reportId,
      params?.page || 1,
      params?.per_page || 10,
      params?.date_from,
      params?.date_to,
    ],
    queryFn: () => reportService.getReportResults(reportId!, params),
    enabled: !!reportId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useReportResult = (resultId?: string) => {
  return useQuery<ApiResponse<ReportResult>, Error>({
    queryKey: ["reportResult", resultId],
    queryFn: () => reportService.getReportResult(resultId!),
    enabled: !!resultId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useScheduledReports = () => {
  return useQuery<ApiResponse<Report[]>, Error>({
    queryKey: ["scheduledReports"],
    queryFn: () => reportService.getScheduledReports(),
    staleTime: 10 * 60 * 1000, // 10 minutes - scheduled reports don't change often
  });
};

// REPORT MUTATION HOOKS

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateReportRequest) => reportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error creating report:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportRequest }) => reportService.updateReport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
    },
    onError: (error) => {
      console.error("Error updating report:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
    },
    onError: (error) => {
      console.error("Error deleting report:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => reportService.generateReport(id),
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ["reportResults", reportId] });
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
    onError: (error) => {
      console.error("Error generating report:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// REPORT RESULT MUTATION HOOKS

export const useDeleteReportResult = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (resultId: string) => reportService.deleteReportResult(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportResults"] });
    },
    onError: (error) => {
      console.error("Error deleting report result:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useExportReportResult = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ resultId, data }: { resultId: string; data?: ExportReportRequest }) =>
      reportService.exportReportResult(resultId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reportResult", variables.resultId] });
    },
    onError: (error) => {
      console.error("Error exporting report result:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useDownloadReportResult = () => {
  const mutation = useMutation({
    mutationFn: (resultId: string) => reportService.downloadReportResult(resultId),
    onError: (error) => {
      console.error("Error downloading report result:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// REPORT SCHEDULING HOOKS

export const useScheduleReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: ScheduleReportRequest }) =>
      reportService.scheduleReport(reportId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
    },
    onError: (error) => {
      console.error("Error scheduling report:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export const useRemoveSchedule = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reportId: string) => reportService.removeSchedule(reportId),
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["scheduledReports"] });
    },
    onError: (error) => {
      console.error("Error removing schedule:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};
