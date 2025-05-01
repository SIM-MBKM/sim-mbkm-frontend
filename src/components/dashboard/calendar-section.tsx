import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CalendarCheck, CalendarClock } from "lucide-react"

// Define the event interface
interface Event {
  id: number;
  date: Date;
  type: "monitoring" | "deadline";
  title: string;
  time: string;
  location: string;
}

// Sample upcoming events
const upcomingEvents: Event[] = [
  { 
    id: 1, 
    date: new Date(2024, 8, 10), 
    type: "monitoring", 
    title: "Monitoring dan Evaluasi ke-2",
    time: "10:00 - 12:00",
    location: "Ruang Meeting Online"
  },
  { 
    id: 2, 
    date: new Date(2024, 8, 15), 
    type: "deadline", 
    title: "Tenggat Pengumpulan Laporan",
    time: "23:59",
    location: "Sistem MBKM"
  },
  { 
    id: 3, 
    date: new Date(2024, 8, 22), 
    type: "monitoring", 
    title: "Monitoring dan Evaluasi ke-3",
    time: "13:00 - 15:00",
    location: "Ruang Meeting Online"
  }
];

export function CalendarSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  // Find events for the selected date
  const eventsForSelectedDate = React.useMemo(() => {
    if (!date) return [];
    
    return upcomingEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  }, [date]);
  
  // Custom renderer for calendar days to highlight dates with events
  const renderDay = (day: Date) => {
    const hasEvent = upcomingEvents.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
    
    const eventType = hasEvent ? 
      upcomingEvents.find(event => 
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
      )?.type : null;
      
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{day.getDate()}</span>
        {hasEvent && (
          <span 
            className={`absolute bottom-1 h-1.5 w-1.5 rounded-full 
              ${eventType === 'monitoring' ? 'bg-blue-500' : 'bg-red-500'}`}
          />
        )}
      </div>
    );
  };

  // Custom handler to properly handle date selection
  const handleSelect = (value: Date | undefined) => {
    setDate(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl font-bold text-[#003478] mb-4 md:mb-6">Jadwal Kegiatan</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div 
          className="lg:col-span-3 border-gray-300 shadow-sm border-[1px] rounded-lg overflow-hidden bg-white"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <Calendar
            selected={date}
            mode="single"
            onSelect={handleSelect}
            className="h-full w-full flex p-3"
            components={{
              Day: (props) => renderDay(props.date)
            }}
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
        </motion.div>
        
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-[#003478] text-white rounded-lg p-4 h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
              <CalendarCheck className="mr-2 h-5 w-5" />
              {eventsForSelectedDate.length > 0 ? 'Kegiatan Hari Ini' : 'Tidak Ada Kegiatan'}
            </h3>
            
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors duration-200"
                    whileHover={{ y: -3 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${event.type === 'monitoring' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                        {event.type === 'monitoring' ? 
                          <CalendarCheck className="h-5 w-5 text-blue-300" /> : 
                          <CalendarClock className="h-5 w-5 text-red-300" />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm text-white/70 mt-1">
                          <div>⏰ {event.time}</div>
                          <div>📍 {event.location}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="bg-white/10 rounded-lg p-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/70">
                  Tidak ada kegiatan terjadwal untuk tanggal ini.
                </p>
                <motion.button
                  className="mt-3 bg-yellow-400 text-[#003478] rounded-full px-4 py-2 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tambah Kegiatan
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="flex items-center mt-4 text-sm space-x-4">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-600">Monitoring</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span className="text-gray-600">Tenggat Waktu</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
