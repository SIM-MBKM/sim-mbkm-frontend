import { apiServices } from "../axios-instance";

const monevApi = apiServices.monev;

/*
 *  Model Interface
 */

export interface Evaluation {
  id: string;
  status: "pending" | "in_progress" | "completed";
  event_id: string;
  mahasiswa_id: string;
  dosen_pemonev_id: string;
  dosen_pembimbing_id: string;
  activity_id: string;
  registration_id: string;
  scores: EvaluationScore[];
}

export interface EvaluationList {
  id: string;
  status: "pending" | "in_progress" | "completed";
  registration_id?: string;
  mahasiswa_id: string;
  dosen_pemonev_id: string;
}

export interface EvaluationScore {
  id: string;
  score: number;
  grade_letter: string;
}

export interface PartnerRating {
  id: string;
  activity_id: string;
  auth_user_id: string;
  rating: number;
  comment: string;
  is_anonymous: boolean;
  is_published: boolean;
  approved_by?: string;
  approved_at?: Date;
}

export interface PartnerRatingList {
  id: string;
  activity_id: string;
  auth_user_id: string;
  rating: number;
  is_anonymous: boolean;
  is_published: boolean;
}

/*
 * Creation, Update, Delete
 */
export interface EvaluationCreateInput {
  event_id?: string;
  mahasiswa_id: string;
  dosen_pemonev_id: string;
  registration_id: string;
  status: "pending" | "in_progress" | "completed";
}

export interface EvaluationUpdateInput {
  id: string;
  event_id?: string;
  mahasiswa_id: string;
  dosen_pemonev_id: string;
  registration_id: string;
  status: "pending" | "in_progress" | "completed";
}

export interface EvaluationFinalize {
  id: string;
}

export interface EvaluationDelete {
  id: string;
}

export interface EvaluationScoreUpdateInput {
  evaluation_id: string;
  id: string;
  score: number;
  grade_letter: string;
}

export interface PartnerRatingCreateInput {
  activity_id: string;
  // auth_user_id: string;
  rating: number;
  comment: string;
  is_anonymous?: boolean;
  // is_published?: boolean;
}

export interface PartnerRatingPublish {
  id: string;
}

/*
 * Detail and List Response
 */
export interface EvaluationResponse {
  message: string;
  status: string;
  data: Evaluation;
}

export interface EvaluationScoreResponse {
  message: string;
  status: string;
  data: EvaluationScore;
}

export interface PartnerRatingResponse {
  message: string;
  status: string;
  data: PartnerRating;
}

/*
 * Paginated Response
 */
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

export interface BaseResponse<T> {
  message: string;
  status: string;
  data: T;
}

export interface BaseResponseNoData {
  message: string;
  status: string;
}

// Evaluation endpoints
export const monevService = {
  submitEvaluation: async (evaluationInput: EvaluationCreateInput): Promise<EvaluationResponse> => {
    const response = await monevApi.post<EvaluationResponse>("/evaluations", evaluationInput);
    return response.data;
  },

  updateEvaluation: async (evaluationInput: EvaluationUpdateInput): Promise<EvaluationResponse> => {
    const response = await monevApi.patch<EvaluationResponse>(`/evaluations/${evaluationInput.id}`, evaluationInput);
    return response.data;
  },

  getEvaluationById: async (id: string): Promise<EvaluationResponse> => {
    const response = await monevApi.get<EvaluationResponse>(`/evaluations/${id}`);
    return response.data;
  },

  getEvaluations: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<EvaluationList>> => {
    const response = await monevApi.get<PaginatedResponse<EvaluationList>>("/evaluations/all", {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  },

  getEvaluationsByMahasiswaId: async (
    mahasiswaId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<EvaluationList>> => {
    const response = await monevApi.get<PaginatedResponse<EvaluationList>>(`/evaluations/mahasiswa/${mahasiswaId}`, {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  },

  getEvaluationsByDosenPemonevId: async (
    dosenPemonevId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<EvaluationList>> => {
    const response = await monevApi.get<PaginatedResponse<EvaluationList>>(
      `/evaluations/dosen-pemonev/${dosenPemonevId}`,
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    );

    return response.data;
  },

  getEvaluationsByPemonevMe: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<EvaluationList>> => {
    const response = await monevApi.get<PaginatedResponse<EvaluationList>>("/evaluations/pemonev-me", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  getEvaluationsByMahasiswaMe: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<EvaluationList>> => {
    const response = await monevApi.get<PaginatedResponse<EvaluationList>>("/evaluations/mahasiswa-me", {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  finalizeEvaluation: async (evaluationFinalize: EvaluationFinalize): Promise<EvaluationResponse> => {
    const response = await monevApi.patch<EvaluationResponse>(
      `/evaluations/${evaluationFinalize.id}/submit`,
      evaluationFinalize
    );
    return response.data;
  },

  deleteEvaluation: async (evaluationDelete: EvaluationDelete): Promise<EvaluationResponse> => {
    const response = await monevApi.delete<EvaluationResponse>(`/evaluations/${evaluationDelete.id}`);
    return response.data;
  },

  updateEvaluationScore: async (evaluationScoreInput: EvaluationScoreUpdateInput): Promise<EvaluationScoreResponse> => {
    const { evaluation_id, id, ...scoreData } = evaluationScoreInput;
    const response = await monevApi.put<EvaluationScoreResponse>(
      `/evaluations/${evaluation_id}/scores/${id}`,
      scoreData
    );
    return response.data;
  },

  submitPartnerRating: async (partnerRatingInput: PartnerRatingCreateInput): Promise<PartnerRatingResponse> => {
    const response = await monevApi.post<PartnerRatingResponse>("/partner-ratings", partnerRatingInput);
    return response.data;
  },

  getPartnerRatings: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<PartnerRatingList>> => {
    const response = await monevApi.get<PaginatedResponse<PartnerRatingList>>("/partner-ratings", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },

  getPartnerRatingsByActivity: async (
    activityId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<PartnerRatingList>> => {
    const response = await monevApi.get<PaginatedResponse<PartnerRatingList>>(
      `/partner-ratings/activity/${activityId}`,
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    );

    return response.data;
  },

  getPartnerRatingById: async (id: string): Promise<PartnerRatingResponse> => {
    const response = await monevApi.get<PartnerRatingResponse>(`/partner-ratings/${id}`);
    return response.data;
  },

  publishPartnerRating: async (partnerRatingPublish: PartnerRatingPublish): Promise<PartnerRatingResponse> => {
    const response = await monevApi.patch<PartnerRatingResponse>(`/partner-ratings/${partnerRatingPublish.id}/publish`);
    return response.data;
  },

  deletePartnerRating: async (partnerRatingId: string): Promise<PartnerRatingResponse> => {
    const response = await monevApi.delete<PartnerRatingResponse>(`/partner-ratings/${partnerRatingId}`);
    return response.data;
  },
};
