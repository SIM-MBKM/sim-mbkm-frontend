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
  type EquivalenceRequest,
  type RegisterInput,
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

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => activityService.getActivities(),
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

// type ProgramFilters = {
//   category?: string;
//   status?: string;
//   partner?: string;
//   search?: string;
// };

// export const usePrograms = (page = 1, limit = 10, filters?: ProgramFilters) => {
//   return useQuery({
//     queryKey: ['programs', page, limit, filters],
//     queryFn: () => registrationService.getPrograms(page, limit, filters),
//     placeholderData: keepPreviousData,
//   });
// };

// export const useProgramById = (id?: string) => {
//   return useQuery({
//     queryKey: ['program', id],
//     queryFn: () => registrationService.getProgramById(id!),
//     enabled: !!id,
//   });
// };

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

export const useStudentRegistrations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['studentRegistrations', page, limit],
    queryFn: () => registrationService.getRegistrationByStudent(page, limit),
  });
};

// MONITORING HOOKS
export const useReportSchedulesByStudent = () => {
  return useQuery({
    queryKey: ['reportSchedulesByStudent'],
    queryFn: () => monitoringService.getReportSchedulesByStudent(),
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

export const useUniversityCourses = (departmentId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['universityCourses', departmentId, page, limit],
    queryFn: () => matchingService.getUniversityCourses(departmentId, page, limit),
    enabled: !!departmentId,
  });
};

export const useSubmitEquivalenceRequest = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (equivalenceData: EquivalenceRequest) => 
      matchingService.submitEquivalenceRequest(equivalenceData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equivalenceRequests', variables.programId] });
    },
  });
  
  return {
    ...mutation,
    isLoading: mutation.isPending
  };
};

export const useEquivalenceRequests = (programId?: string) => {
  return useQuery({
    queryKey: ['equivalenceRequests', programId],
    queryFn: () => matchingService.getUserEquivalenceRequests(programId),
  });
};

export const useProgramCourses = (programId?: string) => {
  return useQuery({
    queryKey: ['programCourses', programId],
    queryFn: () => matchingService.getProgramCourses(programId!),
    enabled: !!programId,
  });
};
