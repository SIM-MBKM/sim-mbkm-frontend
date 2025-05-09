import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  activityService,
  authService,
  matchingService,
  monitoringService,
  registrationService,
  userService,
  type LoginCredentials,
  type SignupCredentials,
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
} from '../services';
import { fileService } from '../services/file-service';

// AUTH HOOKS

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useSignup = () => {
  const mutation = useMutation({
    mutationFn: (userData: SignupCredentials) => 
      authService.signup(userData),
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

// USER HOOKS

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    retry: 1,
  });
};

export const useUserRole = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: () => userService.getUserRole(),
    retry: 1,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UserUpdateInput }) => 
      userService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

// ACTIVITY HOOKS

export const useGetTotalMatchedStatusActivities = () => {
  return useQuery({
    queryKey: ['totalMatchedStatusActivities', 'activities'],
    queryFn: () => activityService.getTotalMatchedStatusActivities(),
  });
}

export const useGetAcademicYears = () => {
  return useQuery({
    queryKey: ['academicYears'],
    queryFn: () => activityService.getAcademicYears(),
  });
}

export const useAllProgramTypes = () => {
  return useQuery({
    queryKey: ['program_types'], // Add token to query key
    queryFn: () => activityService.getAllProgramTypes(),
  });
};

export const useAllLevels = () => {
  return useQuery({
    queryKey: ['levels'], // Add token to query key
    queryFn: () => activityService.getAllLevels(),
  });
};

export const useAllGroups = () => {
  return useQuery({
    queryKey: ['groups'], // Add token to query key
    queryFn: () => activityService.getAllGroups(),
  });
};

export const useActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ['activities', page, limit, filters],
    queryFn: () => activityService.getActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useUnmatchedActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ['activities', 'unmatched', page, limit, filters],
    queryFn: () => activityService.getUnmatchedActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useMatchedActivities = (page = 1, limit = 10, filters: ActivityFilter) => {
  return useQuery<ActivityAllResponse, Error>({
    queryKey: ['activities', 'matched', page, limit, filters],
    queryFn: () => activityService.getMatchedActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
  });
};

export const useUpdateActivityById = (id: string, activityData: ActivityUpdateInput) => {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => activityService.updateActivityById(id, activityData),
  });
};

export const useActivityById = (id?: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => activityService.getActivityById(id!),
    enabled: !!id,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (activityData: ActivityCreateInput) => 
      activityService.createActivity(activityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ id, activityData }: { id: string; activityData: Partial<ActivityCreateInput> }) => 
      activityService.updateActivity(id, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', variables.id] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useUpcomingActivities = () => {
  return useQuery({
    queryKey: ['activities', 'upcoming'],
    queryFn: () => activityService.getUpcomingActivities(),
  });
};

// REGISTRATION HOOKS
export const useCheckEligibility = (activity_id: string) => {
  return useQuery({
    queryKey: ['checkEligibility', activity_id],
    queryFn: () => registrationService.checkEligibility(activity_id),
  });
}

export const useApproveStudentRegistrations = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (approvalInput: ApprovalInput) => 
      registrationService.approveStudentRegistrations(approvalInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    },
    onError: (error) => {
      console.error('Error approving student registrations:', error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
  
}

export const useRegistrationAdvisor = ({page, limit, filter}: {page: number, limit: number, filter: RegistrationFilter}) => {
  return useQuery({
    queryKey: ['userRegistrations', page, limit, filter],
    queryFn: () => registrationService.getRegistrationAdvisor({page, limit, filter}),
  });
}

export const useRegistrationLOMBKM = ({page, limit, filter}: {page: number, limit: number, filter: RegistrationFilter}) => {
  return useQuery({
    queryKey: ['userRegistrations', page, limit, filter],
    queryFn: () => registrationService.getRegistrationLOMBKM({page, limit, filter}),
  });
}

export const useRegistrationStudentMatching = () => {
  return useQuery({
    queryKey: ['registrationStudentMatching'],
    queryFn: () => registrationService.getRegistrationStudentMatching(),
  });
};

export const useRegisterForProgram = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (registrationData: RegisterInput) => 
      registrationService.registerForProgram(registrationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    },
    onError: (error) => {
      console.error('Error registering for program:', error);
    },  
  });
  
  // Add isLoading property for backward compatibility
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useUserRegistrations = () => {
  return useQuery({
    queryKey: ['userRegistrations'],
    queryFn: () => registrationService.getUserRegistrations(),
  });
};

export const useRegistrationTranscriptsByStudent = () => {
  return useQuery({
    queryKey: ['registrationTranscriptsByStudent'],
    queryFn: () => registrationService.getRegistrationTranscriptsByStudent(),
  });
};

export const useRegistrationSyllabusesByStudent = () => {
  return useQuery({
    queryKey: ['registrationSyllabusesByStudent'],
    queryFn: () => registrationService.getRegistrationSyllabusesByStudent(),
  });
};

export const useStudentRegistrations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['registrationStudentMatching', page, limit],
    queryFn: () => registrationService.getRegistrationByStudent(page, limit),
  });
};

export const useUpdateRegistrationStudentById = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, registrationInput }: { id: string; registrationInput: RegistrationUpdateRequest }) => 
      registrationService.updateRegistrationStudentById(id, registrationInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationStudentMatching'] });
    },
    onError: (error) => {
      console.error('Error submitting transcripts:', error);
    },  
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  };
}

export const useFilterSubject = ({ limit, page, filter }: { limit: number, page: number, filter: SubjectFilterRequest }) => {
  return useQuery({
    queryKey: ['filterSubject', filter, limit, page],
    queryFn: () => matchingService.getFilterSubject({ limit, page, filter }),
  });
}

// MONITORING HOOKS

export const useReportSchedulesByAdvisor = ({page, limit, input}: {page: number, limit: number, input: ReportScheduleByAdvisorInput}) => {
  return useQuery({
    queryKey: ['reportSchedulesByAdvisor', page, limit, input],
    queryFn: () => monitoringService.getReportSchedulesByAdvisor({page, limit, input}),
  });
}



export const useTranscriptsByAdvisor = ({page, limit, transcriptByAdvisorInput}: {page: number, limit: number, transcriptByAdvisorInput: TranscriptByAdvisorInput}) => {
  return useQuery({
    queryKey: ['transcriptsByAdvisor', page, limit, transcriptByAdvisorInput],
    queryFn: () => monitoringService.getTranscriptsByAdvisor({page, limit, transcriptByAdvisorInput}),
  });
}

export const useSyllabusesByAdvisor = ({page, limit, syllabusByAdvisorInput}: {page: number, limit: number, syllabusByAdvisorInput: SyllabusByAdvisorInput}) => {
  return useQuery({
    queryKey: ['syllabusesByAdvisor', page, limit, syllabusByAdvisorInput],
    queryFn: () => monitoringService.getSyllabusesByAdvisor({page, limit, syllabusByAdvisorInput}),
  });
}

export const useReportsApproval = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reportApprovalInput: ReportApprovalInput) =>
      monitoringService.reportsApproval(reportApprovalInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportSchedulesByAdvisor'] });
    },
    onError: (error) => {
      console.error('Error approving reports:', error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
}

export const useSubmitTranscript = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (transcriptInput: TranscriptInput) => 
      monitoringService.submitTranscript(transcriptInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationTranscriptsByStudent'] });
    },
    onError: (error) => {
      console.error('Error submitting transcripts:', error);
    },  
  });
  
  // Add isLoading property for backward compatibility
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};


export const useSubmitSyllabus = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (syllabusInput: SyllabusInput) => 
      monitoringService.submitSyllabus(syllabusInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationSyllabusesByStudent'] });
    },
    onError: (error) => {
      console.error('Error submitting syllabus', error);
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
}

export const useDeleteTranscript = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => 
      monitoringService.deleteTranscript(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationTranscriptsByStudent'] });
    },
    onError: (error) => {
      console.error('Error deleting transcript:', error);
    },  
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useDeleteSyllabus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => 
      monitoringService.deleteSyllabus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationSyllabusesByStudent'] });
    },
    onError: (error) => {
      console.error('Error deleting syllabus:', error);
    },  
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useReportSchedulesByStudent = () => {
  return useQuery({
    queryKey: ['reportSchedulesByStudent'],
    queryFn: () => monitoringService.getReportSchedulesByStudent(),
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (reportInput: ReportInput) => 
      monitoringService.submitReport(reportInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportSchedulesByStudent'] });
    },
    onError: (error) => {
      console.error('Error submitting report', error);
    }
  })

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
}
export const useTranscriptsByStudent = () => {
  return useQuery({
    queryKey: ['transcriptsByStudent'],
    queryFn: () => monitoringService.getTranscriptsByStudent(),
  });
};

export const useUserLogbooks = (programId?: string) => {
  return useQuery({
    queryKey: ['logbooks', programId],
    queryFn: () => monitoringService.getUserLogbooks(programId),
  });
};

export const useLogbookById = (id?: string) => {
  return useQuery({
    queryKey: ['logbook', id],
    queryFn: () => monitoringService.getLogbookById(id!),
    enabled: !!id,
  });
};

export const useSubmitLogbook = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (logbookData: LogbookInput) => 
      monitoringService.submitLogbook(logbookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logbooks', variables.programId] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useUpdateLogbook = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ id, logbookData }: { id: string; logbookData: Partial<LogbookInput> }) => 
      monitoringService.updateLogbook(id, logbookData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logbooks'] });
      queryClient.invalidateQueries({ queryKey: ['logbook', variables.id] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useMonitoringSessions = (programId?: string) => {
  return useQuery({
    queryKey: ['monitoringSessions', programId],
    queryFn: () => monitoringService.getMonitoringSessions(programId),
  });
};

// MATCHING HOOKS

export const useSubmitEquivalenceRequest = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (equivalentInput: EquivalentInput) =>
      matchingService.submitEquivalents(equivalentInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationStudentMatching'] });
    },
    onError: (error) => {
      console.error('Error submitting equivalent ', error);
    }
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useSubmitSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (subjectInput: SubjectInput) =>
      matchingService.submitSubjects(subjectInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects' ,'activities'] });
    },
    onError: (error) => {
      console.error('Error submitting subject:', error);
    }
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  };
}

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, subjectInput }: { id: string; subjectInput: SubjectInput }) =>
      matchingService.updateSubjects(id, subjectInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects' ,'activities'] });
    },
    onError: (error) => {
      console.error('Error updating subject:', error);
    }
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  };
}

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (subjectId: string) =>
      matchingService.deleteSubject(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects' ,'activities'] });
    },
    onError: (error) => {
      console.error('Error deleting subject:', error);
    }
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  };
}

export const useSubmitMatchingRequest = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (matchingInput: MatchingInput) => {
      console.log('Submitting matching request with input:', matchingInput);
      const response = await matchingService.submitMatchings(matchingInput);
      console.log('Matching request response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Matching request successful:', data);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['totalMatchedStatusActivities'] });
    },
    onError: (error) => {
      console.error('Error submitting matching:', error);
    }
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useSubjects = ({page, limit, subjectFilter}: {page: number, limit: number, subjectFilter: SubjectFilter}) => {
  return useQuery({
    queryKey: ['subjects','activities', page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjects({page, limit, subjectFilter}),
  });
}

export const useSubjectsGeofisika = ({page, limit, subjectFilter}: {page: number, limit: number, subjectFilter: SubjectFilter}) => {
  return useQuery({
    queryKey: ['subjects','activities', page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjectsGeofisika({page, limit, subjectFilter}),
  });
}

export const useSubjectsNonGeofisika = ({page, limit, subjectFilter}: {page: number, limit: number, subjectFilter: SubjectFilter}) => {
  return useQuery({
    queryKey: ['subjects','activities', page, limit, subjectFilter],
    queryFn: () => matchingService.getSubjectsNonGeofisika({page, limit, subjectFilter}),
  });
}

export const useTotalSubjects = () => {
  return useQuery({
    queryKey: ['totalSubjects', 'activities', 'subjects'],
    queryFn: () => matchingService.getTotalSubjects(),
  });
}

// FILE HOOKS
export const useGetTemporaryLink = (fileId: string) => {
  return useQuery({
    queryKey: ['temporaryLink', fileId],
    queryFn: () => fileService.GCSGetTemporaryLink(fileId),
    enabled: !!fileId && fileId.trim() !== '', // Only run the query if fileId is not empty
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};