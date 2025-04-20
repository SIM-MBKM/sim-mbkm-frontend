import { apiServices } from '../axios-instance';

const registrationApi = apiServices.registration;

export interface Program {
  id: string;
  title: string;
  description: string;
  partner: string;
  category: string;
  startDate: string;
  endDate: string;
  credits: number;
  seats: number;
  requirements: string[];
  status: string;
}

export interface Registration {
  id: string;
  userId: string;
  programId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  documents: {
    id: string;
    type: string;
    url: string;
  }[];
  program?: Program;
}

export interface RegisterInput {
  programId: string;
  documents: {
    type: string;
    url: string;
  }[];
}

// Registration management service endpoints
export const registrationService = {
  // Get all available programs
  getPrograms: async (
    page = 1, 
    limit = 10, 
    filters?: { 
      category?: string; 
      partner?: string;
      status?: string;
    }
  ) => {
    let url = `/programs?page=${page}&limit=${limit}`;
    
    if (filters) {
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.partner) url += `&partner=${filters.partner}`;
      if (filters.status) url += `&status=${filters.status}`;
    }
    
    const response = await registrationApi.get<{programs: Program[], total: number}>(url);
    return response.data;
  },

  // Get program by ID
  getProgramById: async (id: string) => {
    const response = await registrationApi.get<Program>(`/programs/${id}`);
    return response.data;
  },

  // Register for a program
  registerForProgram: async (registrationData: RegisterInput) => {
    const response = await registrationApi.post<Registration>('/registrations', registrationData);
    return response.data;
  },

  // Get user's registrations
  getUserRegistrations: async () => {
    const response = await registrationApi.get<Registration[]>('/registrations/my');
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (registrationId: string) => {
    const response = await registrationApi.delete(`/registrations/${registrationId}`);
    return response.data;
  },

  // Update registration documents
  updateRegistrationDocuments: async (
    registrationId: string, 
    documents: { type: string; url: string }[]
  ) => {
    const response = await registrationApi.patch<Registration>(
      `/registrations/${registrationId}/documents`, 
      { documents }
    );
    return response.data;
  },

  // Search programs
  searchPrograms: async (query: string, page = 1, limit = 10) => {
    const response = await registrationApi.get<{programs: Program[], total: number}>(
      `/programs/search?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
}; 