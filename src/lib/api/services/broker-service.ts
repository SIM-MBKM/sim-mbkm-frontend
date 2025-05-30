import { apiServices } from "../axios-instance";
import { BaseResponse } from './registration-service';

const brokerApi = apiServices.broker;

export interface StatisticDashboardDosenPembimbing {
  total_notification: number;
  notification_percentage_from_last_month: number;
  total: number;
  total_approved: number;
  total_percentage_from_last_month: number;
  total_approved_percentage_from_last_month: number;
}

export const brokerService = {
  getStatisticDashboardDosenPembimbing: async () => {
    const response = await brokerApi.get<BaseResponse<StatisticDashboardDosenPembimbing>>(
      "/statistic-dashboard-dosen-pembimbing"
    );
    return response.data;
  },
};
