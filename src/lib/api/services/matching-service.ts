import { apiServices } from '../axios-instance';

const matchingApi = apiServices.matching;

export interface CourseEquivalence {
  id: string;
  studentId: string;
  programId: string;
  mbkmCourse: {
    id: string;
    name: string;
    code: string;
    credits: number;
  };
  universityEquivalentCourses: {
    id: string;
    name: string;
    code: string;
    credits: number;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  supervisorNotes?: string;
}

export interface EquivalenceRequest {
  programId: string;
  mbkmCourse: {
    name: string;
    code: string;
    credits: number;
  };
  universityEquivalentCourses: {
    id: string;
  }[];
}

// Matching management service endpoints
export const matchingService = {
  // Get university courses
  getUniversityCourses: async (
    departmentId: string,
    page = 1,
    limit = 20
  ) => {
    const response = await matchingApi.get(
      `/university-courses?departmentId=${departmentId}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Search university courses
  searchUniversityCourses: async (query: string, departmentId?: string) => {
    let url = `/university-courses/search?q=${query}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    
    const response = await matchingApi.get(url);
    return response.data;
  },

  // Submit equivalence request
  submitEquivalenceRequest: async (equivalenceData: EquivalenceRequest) => {
    const response = await matchingApi.post<CourseEquivalence>(
      '/course-equivalence', 
      equivalenceData
    );
    return response.data;
  },

  // Get user's equivalence requests
  getUserEquivalenceRequests: async (programId?: string) => {
    let url = '/course-equivalence/my';
    if (programId) url += `?programId=${programId}`;
    
    const response = await matchingApi.get<CourseEquivalence[]>(url);
    return response.data;
  },

  // Get single equivalence request
  getEquivalenceRequestById: async (id: string) => {
    const response = await matchingApi.get<CourseEquivalence>(`/course-equivalence/${id}`);
    return response.data;
  },

  // Update equivalence request
  updateEquivalenceRequest: async (id: string, equivalenceData: Partial<EquivalenceRequest>) => {
    const response = await matchingApi.put<CourseEquivalence>(
      `/course-equivalence/${id}`, 
      equivalenceData
    );
    return response.data;
  },

  // Delete equivalence request
  deleteEquivalenceRequest: async (id: string) => {
    const response = await matchingApi.delete(`/course-equivalence/${id}`);
    return response.data;
  },

  // Get program courses offered by partner
  getProgramCourses: async (programId: string) => {
    const response = await matchingApi.get(`/programs/${programId}/courses`);
    return response.data;
  },
}; 