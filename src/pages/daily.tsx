import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Trash2 } from 'lucide-react';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  activities: string[];
}

export default function DailyPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [entries, setEntries] = React.useState<TimeEntry[]>([])
  const [open, setOpen] = React.useState(false)
  const [entryToDelete, setEntryToDelete] = React.useState<TimeEntry | null>(null)

  const handleDelete = (entryToDelete: TimeEntry) => {
    if (typeof window === 'undefined') return;

    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (entriesStr) {
        const allEntries: TimeEntry[] = JSON.parse(entriesStr);
        // Filter out the entry to delete
        const updatedEntries = allEntries.filter(entry =>
          entry.date !== entryToDelete.date ||
          entry.ministryHours !== entryToDelete.ministryHours ||
          entry.bibleStudies !== entryToDelete.bibleStudies ||
          !arraysEqual(entry.activities, entryToDelete.activities)
        );

        // Save back to localStorage
        localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));

        // Update local state
        setEntries(updatedEntries);
        setOpen(false);

        // Force reload entries in other components
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  // Helper function to compare arrays
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  const loadEntries = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (entriesStr) {
        const allEntries: TimeEntry[] = JSON.parse(entriesStr);
        // Sort entries by date, newest first
        const sortedEntries = allEntries.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sortedEntries);
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

  React.useEffect(() => {
    // Reset date to current date when component unmounts or route changes
    return () => {
      setDate(new Date());
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Daily Report</h1>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "max-w-[300px] w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 ml-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setDate(new Date())}
        >
          Today
        </Button>
      </div>
      <Separator />
      {filteredEntries.length === 0 ? (
        <p className="text-muted-foreground">No entries found for this date.</p>
      ) : (
        <div className="space-y-2">
          {filteredEntries.map((entry, index) => (
            <Card key={index} className="p-4 space-y-2">
              <CardHeader className="flex flex-row items-start justify-between p-0 m-0">
                <div className="space-y-1">
                  <CardTitle>{entry.ministryHours} {entry.ministryHours === 1 ? 'Hour' : 'Hours'}</CardTitle>
                  {entry.bibleStudies > 0 && (
                    <CardDescription>{entry.bibleStudies} Bible {entry.bibleStudies === 1 ? 'Study' : 'Studies'}</CardDescription>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <button className="p-2 border rounded hover:bg-accent" onClick={() => setEntryToDelete(entry)}>
                        <Trash2 color="#dc2626" size={14} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className={geistSans.className + " w-[280px] rounded-md"}>
                      <DialogHeader className="text-left">
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your entry.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="destructive" className="w-20" onClick={() => handleDelete(entryToDelete as TimeEntry)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
