import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  activities: string[];
}

export default function DailyPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [entries, setEntries] = React.useState<TimeEntry[]>([])

  const loadEntries = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (entriesStr) {
        const allEntries: TimeEntry[] = JSON.parse(entriesStr);
        setEntries(allEntries);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }, []);

  React.useEffect(() => {
    loadEntries();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent | Event) => {
      if (!e.hasOwnProperty('key') || (e as StorageEvent).key === 'timeEntries') {
        loadEntries();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadEntries]);

  const filteredEntries = React.useMemo(() => {
    if (!date) return [];
    const selectedDate = format(date, 'yyyy-MM-dd');
    return entries.filter(entry => {
      const entryDate = format(new Date(entry.date), 'yyyy-MM-dd');
      return entryDate === selectedDate;
    });
  }, [date, entries]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Daily Report</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {filteredEntries.length === 0 ? (
        <p className="text-muted-foreground">No entries found for this date.</p>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <Card key={index} className="p-4">
              <CardHeader className="p-0">
                <div className="space-y-1">
                  <CardTitle>{entry.ministryHours} Hours</CardTitle>
                  <CardDescription>{entry.bibleStudies} Bible {entry.bibleStudies === 1 ? 'Study' : 'Studies'}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4 flex flex-wrap gap-2">
                {entry.activities.map((activity, idx) => (
                  <Badge key={idx} variant="secondary">{activity}</Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
