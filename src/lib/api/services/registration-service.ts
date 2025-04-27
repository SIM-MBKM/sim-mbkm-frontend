import { apiServices } from '../axios-instance';

const registrationApi = apiServices.registration;

// GetRegistrationResponse struct {
//   ID                        string             `json:"id"`
//   ActivityID                string             `json:"activity_id"`
//   UserID                    string             `json:"user_id"`
//   UserNRP                   string             `json:"user_nrp"`
//   UserName                  string             `json:"user_name"`
//   AdvisingConfirmation      bool               `json:"advising_confirmation"`
//   AcademicAdvisor           string             `json:"academic_advisor"`
//   AcademicAdvisorEmail      string             `json:"academic_advisor_email"`
//   MentorName                string             `json:"mentor_name"`
//   MentorEmail               string             `json:"mentor_email"`
//   LOValidation              string             `json:"lo_validation"`
//   AcademicAdvisorValidation string             `json:"academic_advisor_validation"`
//   Semester                  string             `json:"semester"`
//   TotalSKS                  int                `json:"total_sks"`
//   ActivityName              string             `json:"activity_name"`
//   ApprovalStatus            bool               `json:"approval_status"`
//   Documents                 []DocumentResponse `json:"documents"`
//   Equivalents               interface{}        `json:"equivalents"`
// }

// DocumentResponse struct {
//   ID             string `json:"id"`
//   RegistrationID string `json:"registration_id"`
//   FileStorageID  string `json:"file_storage_id"`
//   Name           string `json:"name"`
//   DocumentType   string `json:"document_type"`
// }


// CreateRegistrationRequest struct {
//   ActivityID           string `form:"activity_id" binding:"required"`
//   AcademicAdvisorID    string `form:"academic_advisor_id" binding:"required"`
//   AdvisingConfirmation bool   `form:"advising_confirmation" binding:"required"`
//   AcademicAdvisor      string `form:"academic_advisor" binding:"required"` // This field doesn't match what's in your form
//   AcademicAdvisorEmail string `form:"academic_advisor_email" binding:"required"`
//   MentorName           string `form:"mentor_name" binding:"required"`
//   MentorEmail          string `form:"mentor_email" binding:"required"`
//   Semester             string `form:"semester" binding:"required"`
//   TotalSKS             int    `form:"total_sks" binding:"required"`
// }


export interface Document {
  id: string;
  registration_id: string;
  file_storage_id: string;
  name: string;
  document_type: string;
}

export interface Registration {
  id: string;
  activity_id: string;
  user_id: string;
  user_nrp: string;
  user_name: string;
  advising_confirmation: boolean;
  academic_advisor: string;
  academic_advisor_email: string;
  mentor_name: string;
  mentor_email: string;
  lo_validation: 'PENDING' | 'APPROVED' | 'REJECTED';
  academic_advisor_validation: 'PENDING' | 'APPROVED' | 'REJECTED';
  semester: string;
  total_sks: number;
  activity_name: string;
  approval_status: boolean;
  documents: Document[];
  equivalents: unknown;
}

export interface PaginatedResponse<T> {
  message: string;
  status: string;
  data: T[];
  current_page: number;
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
  total_pages: number;
}

// CreateRegistrationRequest struct {
//   ActivityID           string `form:"activity_id" binding:"required"`
//   AcademicAdvisorID    string `form:"academic_advisor_id" binding:"required"`
//   AdvisingConfirmation bool   `form:"advising_confirmation" binding:"required"`
//   AcademicAdvisor      string `form:"academic_advisor" binding:"required"` // This field doesn't match what's in your form
//   AcademicAdvisorEmail string `form:"academic_advisor_email" binding:"required"`
//   MentorName           string `form:"mentor_name" binding:"required"`
//   MentorEmail          string `form:"mentor_email" binding:"required"`
//   Semester             string `form:"semester" binding:"required"`
//   TotalSKS             int    `form:"total_sks" binding:"required"`
// }

export interface RegisterInput {
  activityId: string;
  acceptanceLetter?: File;
  geoletter?: File;
  academic_advisor_id: string;
  advising_confirmation: boolean;
  academic_advisor: string;
  academic_advisor_email: string;
  mentor_name: string;
  mentor_email: string;
  semester: number;
  total_sks: number;
}

// Registration management service endpoints
export const registrationService = {
  // Get all available programs
  // getPrograms: async (
  //   page = 1, 
  //   limit = 10, 
  //   filters?: { 
  //     category?: string; 
  //     partner?: string;
  //     status?: string;
  //   }
  // ) => {
  //   let url = `/programs?page=${page}&limit=${limit}`;
    
  //   if (filters) {
  //     if (filters.category) url += `&category=${filters.category}`;
  //     if (filters.partner) url += `&partner=${filters.partner}`;
  //     if (filters.status) url += `&status=${filters.status}`;
  //   }
    
  //   const response = await registrationApi.get<{programs: Program[], total: number}>(url);
  //   return response.data;
  // },

  // Get program by ID
  // getProgramById: async (id: string) => {
  //   const response = await registrationApi.get<Program>(`/programs/${id}`);
  //   return response.data;
  // },

  // Register for a program
  registerForProgram: async (registrationData: RegisterInput) => {
    // Always use FormData for registration
    const formData = new FormData();
    
    // Add activity ID
    formData.append('activity_id', registrationData.activityId);
    
    // Add advisor information
    formData.append('academic_advisor_id', registrationData.academic_advisor_id);
    formData.append('advising_confirmation', String(registrationData.advising_confirmation));
    formData.append('academic_advisor', registrationData.academic_advisor);
    formData.append('academic_advisor_email', registrationData.academic_advisor_email);
    
    // Add mentor information
    formData.append('mentor_name', registrationData.mentor_name);
    formData.append('mentor_email', registrationData.mentor_email);
    
    // Add academic information
    formData.append('semester', String(registrationData.semester));
    formData.append('total_sks', String(registrationData.total_sks));
    
    // Add files if they exist
    if (registrationData.acceptanceLetter) {
      formData.append('file', registrationData.acceptanceLetter);
    }
    
    if (registrationData.geoletter) {
      formData.append('geoletter', registrationData.geoletter);
    }
    
    // Send the request
    const response = await registrationApi.post<Registration>('/registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's registrations
  getUserRegistrations: async () => {
    const response = await registrationApi.get<Registration[]>('/registrations/my');
    return response.data;
  },

  // Get registrations by student
  getRegistrationByStudent: async (page = 1, limit = 10) => {
    const response = await registrationApi.post<PaginatedResponse<Registration>>(
      `/registration/student?page=${page}&limit=${limit}`,
      {
        "activity_name": "",
        "user_name": "",
        "user_nrp": "",
        "academic_advisor": "",
        "lo_validation": "",
        "academic_advisor_validation": ""
    },
    );
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
    documents: { type: string; file: File }[]
  ) => {
    const formData = new FormData();
    
    documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type);
      formData.append(`documents[${index}][file]`, doc.file);
    });
    
    const response = await registrationApi.patch<Registration>(
      `/registrations/${registrationId}/documents`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Search programs
  // searchPrograms: async (query: string, page = 1, limit = 10) => {
  //   const response = await registrationApi.get<{programs: Program[], total: number}>(
  //     `/programs/search?q=${query}&page=${page}&limit=${limit}`
  //   );
  //   return response.data;
  // },
}; 