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
  PaginatedResponse,
  Activity,
  SyllabusInput,
  ReportInput,
  EquivalentInput,
} from '../services';

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

export const useActivities = (page = 1, limit = 10, filters = {}) => {
  return useQuery<PaginatedResponse<Activity>, Error>({
    queryKey: ['activities', page, limit, filters],
    queryFn: () => activityService.getActivities(page, limit, filters),
    staleTime: 5000, // 5 seconds
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
    queryKey: ['studentRegistrations', page, limit],
    queryFn: () => registrationService.getRegistrationByStudent(page, limit),
  });
};

// MONITORING HOOKS

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
