import { apiServices } from "../axios-instance";

const fileApi = apiServices.file;

export interface FileResponse {
  status: string;
  url: string;
  expired_at: string;
}

export const fileService = {
  GCSGetTemporaryLink: async (fileId: string) => {
    // add query params fileId to the url
    const response = await fileApi.get<FileResponse>(`/gcs/link?fileId=${fileId}`);
    return response.data;
  }
}