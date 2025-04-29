import { apiServices } from '../axios-instance';

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


// Matching management service endpoints
export const matchingService = {
  submitEquivalents: async (equivalentInput: EquivalentInput) => {
    const response = await matchingApi.post<EquivalentResponse<EquivalentInput>>('/equivalent', equivalentInput);
    return response.data;
  }
}; 