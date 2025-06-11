import { apiServices } from "../axios-instance";

const calendarService = apiServices.calendar;

export interface Event {
  id: string;
  title: string;
  description: string;
  // event_date
}

export interface EventParticipant {}
