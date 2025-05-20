import { apiServices } from "../axios-instance";
import { BaseResponse, PaginatedResponse } from "./registration-service";

const notificationApi = apiServices.notification;

export interface Notification {
  id: string;
  sender_name: string;
  sender_email: string;
  receiver_email: string;
  type: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export const notificationService = {

  // Get All Notifications
  getAllNotifications: async (page: number, limit: number) => {
    const response = await notificationApi.get<PaginatedResponse<Notification>>(
      `/notifications?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getNotificationByID: async (id: string) => {
    const response = await notificationApi.get<BaseResponse<Notification>>(
      `/notifications/${id}`
    );
    return response.data;
  },  

  getNotificationBySenderEmail: async(senderEmail: string, page: number, limit: number) => {
    const response = await notificationApi.get<PaginatedResponse<Notification>>(
      `/notifications?page=${page}&limit=${limit}&sender_email=${senderEmail}`
    );
    return response.data;
  },

  getNotificationByReceiverEmail: async(receiverEmail: string, page: number, limit: number) => {
    const response = await notificationApi.get<PaginatedResponse<Notification>>(
      `/notifications?page=${page}&limit=${limit}&receiver_email=${receiverEmail}`
    );
    return response.data;
  },
}

