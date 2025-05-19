import { apiServices } from '../axios-instance';
import { Transcript } from './monitoring-service';

const registrationApi = apiServices.registration;


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
  academic_advisor_id: string;
  mentor_name: string;
  mentor_email: string;
  lo_validation: 'PENDING' | 'APPROVED' | 'REJECTED';
  academic_advisor_validation: 'PENDING' | 'APPROVED' | 'REJECTED';
  semester: number;
  total_sks: number;
  activity_name: string;
  approval_status: boolean;
  documents: Document[];
  equivalents: Equivalent[];
  matching: Matching[];
}

export interface Matching {
  id: string;
  subject_id: string;
  departemen: string;
  kelas: string;
  kode: string;
  mata_kuliah: string;
  prodi_penyelenggara: string;
  semester: number;
  sks: number;
  tipe_mata_kuliah: string;
  documents: Document[];
}

export interface Equivalent {
  id: string;
  subject_id: string;
  departemen: string;
  kelas: string;
  kode: string;
  mata_kuliah: string;
  prodi_penyelenggara: string;
  semester: number;
  sks: number;
  tipe_mata_kuliah: string;
  documents: Document[];
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

export interface RegistrationTranscript {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: number;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  transcript_data: Transcript[]
}

export interface RegistrationTranscriptData {
  user_id: string;
  user_nrp: string;
  registrations: RegistrationTranscript[]
}

export interface RegistrationTranscriptsByStudentResponse {
  message: string;
  status: string;
  data: RegistrationTranscriptData
}

export interface RegistrationStudentMatchingData {
  user_id: string;
  user_nrp: string;
  user_name: string;
  registrations: Registration[]
}

export interface RegistrationStudentMatchingResponse {
  message: string;
  status: string;
  data: RegistrationStudentMatchingData
}

export interface ApprovalInput {
  status: 'APPROVED' | 'REJECTED';
  id: string[];
}

// syllabuses
export interface RegistrationSyllabus {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: number;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  syllabus_data: Transcript[]
}

export interface RegistrationSyllabusData {
  user_id: string;
  user_nrp: string;
  registrations: RegistrationSyllabus[]
}

export interface RegistrationSyllabusesByStudentResponse {
  message: string;
  status: string;
  data: RegistrationSyllabusData
}

export interface RegistrationUpdateRequest {
  academic_advisor: string;
  advising_confirmation: boolean;
  academic_advisor_email: string;
  mentor_name: string;
  mentor_email: string;
  semester: number;
  total_sks: number;
}

export interface BaseResponse<T> {
  message: string;
  status: string;
  data: T
}

export interface Eligibility {
  eligible: boolean;
  message: string;
}

export interface RegistrationFilter {
  activity_name: string;
  user_name: string;
  user_nrp: string;
  academic_advisor: string;
  lo_validation: string;
  academic_advisor_validation: string;
}

// Registration management service endpoints
export const registrationService = {

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

  checkEligibility: async(activity_id: string) => {
    const response = await registrationApi.get<BaseResponse<Eligibility>>(
      `/registration/check-eligibility?activity_id=${activity_id}`
    );
    return response.data;
  },

  updateRegistrationStudentById: async (id: string, data: RegistrationUpdateRequest) => {
    data.advising_confirmation = true;
    const response = await registrationApi.put<{data: string, message: string, status: string}>(
      `/registration/${id}`,
      data,
    );
    return response.data;
  },

  getRegistrationAdvisor: async({page, limit, filter}: {page: number, limit: number, filter: RegistrationFilter}) => {
    const response = await registrationApi.post<PaginatedResponse<Registration>>(
      `/registration/advisor?page=${page}&limit=${limit}`,
      filter,
    );
    return response.data;
  },
 
  getRegistrationLOMBKM: async({page, limit, filter}: {page: number, limit: number, filter: RegistrationFilter}) => {
    const response = await registrationApi.post<PaginatedResponse<Registration>>(
      `/registration/lo-mbkm?page=${page}&limit=${limit}`,
      filter,
    );
    return response.data;
  },
  
  getRegistrationStudentMatching: async () => {
    const response = await registrationApi.post<RegistrationStudentMatchingResponse>(
      '/registration/student/matching',
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

  // Get user's registrations
  getUserRegistrations: async () => {
    const response = await registrationApi.get<Registration[]>('/registrations/my');
    return response.data;
  },

  approveStudentRegistrations: async (approvalInput: ApprovalInput) => {
    const response = await registrationApi.post<BaseResponse<string>>('/registration/approval', approvalInput);
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

  getRegistrationTranscriptsByStudent: async () => {
    const response = await registrationApi.post<RegistrationTranscriptsByStudentResponse>(
      '/registration/student/transcripts',
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

  getRegistrationSyllabusesByStudent: async () => {
    const response = await registrationApi.post<RegistrationSyllabusesByStudentResponse>(
      '/registration/student/syllabuses',
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