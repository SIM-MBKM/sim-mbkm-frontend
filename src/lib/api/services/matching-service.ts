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
  }
}; 