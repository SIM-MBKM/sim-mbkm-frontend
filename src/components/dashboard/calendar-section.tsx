import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function CalendarSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  React.useEffect(() => {
    console.log(date)
  }, [date])

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#003478] mb-4 md:mb-6">Jadwal Monev</h2>
      <div className="border-gray-300 shadow-sm border-[2px] rounded-lg overflow-hidden">
        <Calendar
          selected={date}
          onSelect={setDate}
          className="h-full w-full flex"
          classNames={{
              months: 'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
              month: 'space-y-4 w-full flex flex-col',
              table: 'w-full h-full border-collapse space-y-1',
              head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] w-full',
              cell: cn(
                  '[&:has([aria-selected])]:bg-accent relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                  '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
                  'w-full',
              ),
              day: cn(
                  buttonVariants({ variant: 'ghost' }),
                  'size-8 w-full p-0 font-normal aria-selected:opacity-100',
              ),
          }}
          />
      </div>
      <div className="flex items-center mt-4 text-sm">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        <span className="text-gray-500 mr-6">upcoming</span>
        <span className="text-gray-700">Monitoring and Evaluation</span>
      </div>
    </div>
  )
}
