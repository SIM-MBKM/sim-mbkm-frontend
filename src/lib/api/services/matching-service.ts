import { apiServices } from '../axios-instance';
import { PaginatedResponse, Matching } from './registration-service';


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
  sks: string;
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


// Matching management service endpoints
export const matchingService = {
  submitEquivalents: async (equivalentInput: EquivalentInput) => {
    const response = await matchingApi.post<EquivalentResponse<EquivalentInput>>('/equivalent', equivalentInput);
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

}; 


