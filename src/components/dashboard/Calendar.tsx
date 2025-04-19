import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

interface CalendarEvent {
  date: Date;
  title: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

export function Calendar({ events = [], className = "" }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const startOfSelectedMonth = startOfMonth(currentMonth);
  const endOfSelectedMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: startOfSelectedMonth,
    end: endOfSelectedMonth,
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const hasEvent = (day: Date) => {
    return events.some((event) => isSameDay(event.date, day));
  };

  return (
    <div className={`border rounded-md shadow-sm ${className}`}>
      <div className="p-4 flex items-center justify-between border-b">
        <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 rounded">
          <svg
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M15 18L9 12L15 6" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h3 className="text-lg font-medium">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h3>
        <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
          <svg
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 18L15 12L9 6" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
        {daysInMonth.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const dayHasEvent = hasEvent(day);
          
          return (
            <div 
              key={i} 
              className={`
                h-9 w-9 rounded-full flex items-center justify-center mx-auto text-sm
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${isCurrentDay ? "calendar-cell-highlight" : ""}
                ${dayHasEvent ? "border-2 border-blue-400" : ""}
              `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
} 