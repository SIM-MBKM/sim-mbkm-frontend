import { apiServices } from '../axios-instance';
import { PaginatedResponse, Matching, Document } from './registration-service';


const matchingApi = apiServices.matching;



export interface EquivalentInput {
  registration_id: string;
  subject_id_add?: string[];
  subject_id_remove?: string[];
}

export interface EquivalentResponse<T> {
  message: string;
  status: string;
  data: T
}

export interface SubjectFilterRequest {
  kode: string;
  semester: string;
  prodi_penyelenggara: string;
  kelas: string;
  departement: string;
  tipe_mata_kuliah: string;
}

export interface Subject {
  id: string;
  mata_kuliah: string;
  kode: string;
  semester: string;
  prodi_penyelenggara: string;
  sks: number;
  kelas: string;
  departemen: string;
  tipe_mata_kuliah: string;
  documents: Document[]
}

export interface SubjectFilter {
  kode: string;
  mata_kuliah?: string;
  semester: string;
  prodi_penyelenggara: string;
  kelas: string;
  departemen: string;
  tipe_mata_kuliah: string;
}

export interface MatchingInput {
  activity_id: string;
  subject_id_add?: string[];
  subject_id_remove?: string[];
}

export interface SubjectInput {
  kode: string;
  mata_kuliah: string;
  semester: string;
  prodi_penyelenggara: string;
  sks: number;
  kelas: string;
  departemen: string;
  tipe_mata_kuliah: string;
  file?: File | null;
}

export interface TotalSubjects {
  departemen: string;
  total: number;
}

export interface GetTotalSubjectsResponse {
  message: string;
  status: string;
  data: TotalSubjects[];
}


// Matching management service endpoints
export const matchingService = {
  submitEquivalents: async (equivalentInput: EquivalentInput) => {
    const response = await matchingApi.post<EquivalentResponse<EquivalentInput>>('/equivalent', equivalentInput);
    return response.data;
  },

  submitSubjects: async (subjectInput: SubjectInput) => {
    const formData = new FormData();
    
    subjectInput.mata_kuliah = subjectInput.mata_kuliah
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    subjectInput.departemen = subjectInput.departemen
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    subjectInput.prodi_penyelenggara = subjectInput.prodi_penyelenggara
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Append all text fields
    Object.entries(subjectInput).forEach(([key, value]) => {
      if (key !== 'file' && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append file if it exists
    if (subjectInput.file) {
      formData.append('file', subjectInput.file);
    }

    const response = await matchingApi.post<EquivalentResponse<SubjectInput>>('/subject', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateSubjects: async (id: string, subjectInput: SubjectInput) => {
    const formData = new FormData();
    
    // Append all text fields
    Object.entries(subjectInput).forEach(([key, value]) => {
      if (key !== 'file' && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append file if it exists
    if (subjectInput.file) {
      formData.append('file', subjectInput.file);
    }

    const response = await matchingApi.put<EquivalentResponse<SubjectInput>>(`/subject/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteSubject: async (subjectId: string) => {
    const response = await matchingApi.delete<EquivalentResponse<string>>(`/subject/${subjectId}`);
    return response.data;
  },

  submitMatchings: async (matchingInput: MatchingInput) => {
    const response = await matchingApi.post<EquivalentResponse<MatchingInput>>('/matching', matchingInput);
    return response.data;
  },

  getFilterSubject: async({ limit, page, filter }: { limit: number, page: number, filter: SubjectFilterRequest }) => {
    if (filter.semester === "all") {
      filter.semester = ""
    }
    const response = await matchingApi.post<PaginatedResponse<Matching>>(`/subject/filter?limit=${limit}&page=${page}`, filter);
    return response.data;
  },

  getSubjects: async ({ page, limit, subjectFilter }: { page: number, limit: number, subjectFilter: SubjectFilter }) => {
    // Clean up empty filter values to avoid unnecessary restrictions
    const cleanFilter = Object.fromEntries(
      Object.entries(subjectFilter).filter(([, value]) => value !== "")
    );
    
    console.log("Fetching subjects with filter:", cleanFilter);
    const response = await matchingApi.post<PaginatedResponse<Subject>>(
      `/subject/filter?page=${page}&limit=${limit}`, 
      cleanFilter
    );
    return response.data;
  },

  getSubjectsGeofisika: async ({ page, limit, subjectFilter }: { page: number, limit: number, subjectFilter: SubjectFilter }) => {
    const cleanFilter = Object.fromEntries(
      Object.entries(subjectFilter).filter(([, value]) => value !== "")
    );
    
    console.log("Fetching subjects with filter:", cleanFilter);
    const response = await matchingApi.post<PaginatedResponse<Subject>>(
      `/subject/teknik-geofisika?page=${page}&limit=${limit}`, 
      cleanFilter
    );
    return response.data;
  },

  getSubjectsNonGeofisika: async ({ page, limit, subjectFilter }: { page: number, limit: number, subjectFilter: SubjectFilter }) => {
    const cleanFilter = Object.fromEntries(
      Object.entries(subjectFilter).filter(([, value]) => value !== "")
    );
    
    console.log("Fetching subjects with filter:", cleanFilter);
    const response = await matchingApi.post<PaginatedResponse<Subject>>(
      `/subject/non-teknik-geofisika?page=${page}&limit=${limit}`, 
      cleanFilter
    );
    return response.data;
  },

  getTotalSubjects: async () => {
    const response = await matchingApi.get<GetTotalSubjectsResponse>('/subject/total');
    return response.data;
  },
}; 


