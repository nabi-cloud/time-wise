import * as React from "react"
import { format, isSameMonth } from "date-fns"
import { CalendarIcon, Trash2, Copy } from "lucide-react"
import { Geist } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
import { EditButton } from "@/components/edit-button"
import { MonthlyChart } from "@/components/hour-month-chart";
import { BibleStudiesCard } from "@/components/bs-month-stats-card";
import { ActivityChart } from "@/components/activity-chart"
import { TimeEntry } from "@/types/time-entry"

export default function MonthlyPage() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [buttonText, setButtonText] = React.useState("Copy Report")
  const [totalHours, setTotalHours] = React.useState(0)
  const [totalStudies, setTotalStudies] = React.useState(0)
  const [entries, setEntries] = React.useState<TimeEntry[]>([])
  const [open, setOpen] = React.useState(false)
  const [entryToDelete, setEntryToDelete] = React.useState<TimeEntry | null>(null)

  const handleDelete = (entryToDelete: TimeEntry) => {
    if (typeof window === 'undefined') return;

    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (entriesStr) {
        const allEntries: TimeEntry[] = JSON.parse(entriesStr);
        // Filter out the entry to delete based on exact date
        const updatedEntries = allEntries.filter(entry => entry.date !== entryToDelete.date);

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

  React.useEffect(() => {
    const loadData = () => {
      if (typeof window === 'undefined') return;

      try {
        const entriesStr = localStorage.getItem('timeEntries');
        if (entriesStr) {
          const allEntries = JSON.parse(entriesStr);
          const monthEntries = allEntries.filter((entry: any) =>
            isSameMonth(new Date(entry.date), date)
          );

          const hours = monthEntries.reduce((sum: number, entry: any) =>
            sum + (entry.ministryHours || 0), 0
          );
          const studies = monthEntries.reduce((sum: number, entry: any) =>
            sum + (entry.bibleStudies || 0), 0
          );

          setTotalHours(hours);
          setTotalStudies(studies);
          setEntries(allEntries);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    // Add storage event listener
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [date]);

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day)
    }
  }

  const copyReport = async () => {
    const monthYear = format(date, "MMMM yyyy");
    let reportText = `${monthYear} Report:\n`;
    reportText += `Shared in Ministry: ${totalHours > 0 ? "Yes" : "No"}\n`;

    if (totalHours > 0) {
      reportText += `${totalHours} Hours\n`;
    }

    if (totalStudies > 0) {
      reportText += `${totalStudies} Bible ${totalStudies === 1 ? "Study" : "Studies"}`;
    }

    try {
      await navigator.clipboard.writeText(reportText);
      setButtonText("Copied!");
      setTimeout(() => setButtonText("Copy Report"), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setButtonText("Failed to copy");
      setTimeout(() => setButtonText("Copy Report"), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Monthly Report</h1>
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
              {date ? format(date, "MMM yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 ml-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
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
      <div className="space-y-4">
        <div>
          <Button onClick={copyReport}>
            <Copy className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MonthlyChart selectedDate={date} />
          <div className="col-span-2 md:col-span-1 space-y-4">
            <BibleStudiesCard selectedDate={date} />
            <ActivityChart entries={entries} />
          </div>
        </div>
        <Separator />
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Monthly Entries</h2>
          {entries.filter(entry => isSameMonth(new Date(entry.date), date)).length === 0 ? (
            <p className="text-muted-foreground">No entries found for this month.</p>
          ) : (
            <div className="space-y-2">
              {entries
                .filter(entry => isSameMonth(new Date(entry.date), date))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, index) => (
                  <Card key={index} className="p-4 space-y-2">
                    <CardHeader className="flex flex-row items-start justify-between p-0 m-0">
                      <div className="space-y-1">
                        <CardTitle>{entry.ministryHours} {entry.ministryHours === 1 ? 'Hour' : 'Hours'}</CardTitle>
                        {entry.bibleStudies > 0 && (
                          <CardDescription>{entry.bibleStudies} Bible {entry.bibleStudies === 1 ? 'Study' : 'Studies'}</CardDescription>
                        )}
                        <CardDescription>
                          {format(new Date(entry.date), 'MMMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex justify-start gap-2">
                        <EditButton
                          entry={{
                            date: new Date(entry.date),
                            ministryHours: entry.ministryHours || 0,
                            bibleStudies: entry.bibleStudies || 0,
                            houseToHouse: entry.activities.includes('House to House'),
                            bibleStudy: entry.activities.includes('Bible Study'),
                            returnVisit: entry.activities.includes('Return Visit'),
                            cartWitnessing: entry.activities.includes('Cart Witnessing'),
                            letterWriting: entry.activities.includes('Letter Writing'),
                            informalWitnessing: entry.activities.includes('Informal Witnessing'),
                            others: entry.activities.includes('Others'),
                            activities: entry.activities || []
                          }}
                          onSave={(updatedEntry) => {
                            const entriesStr = localStorage.getItem('timeEntries');
                            if (entriesStr) {
                              const allEntries: TimeEntry[] = JSON.parse(entriesStr);
                              const updatedEntries = allEntries.map(e =>
                                e.date === entry.date ? { ...updatedEntry, date: format(updatedEntry.date, 'yyyy-MM-dd') } : e
                              );
                              localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
                              window.dispatchEvent(new Event('storage'));
                            }
                          }}
                        />
                        <Dialog open={open && entryToDelete?.date === entry.date} onOpenChange={setOpen}>
                          <DialogTrigger>
                            <Button variant="outline" className="h-8 w-8 px-0" onClick={() => setEntryToDelete(entry)}>
                              <Trash2 color="#dc2626" size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={geistSans.className + " w-[280px] rounded-md"}>
                            <DialogHeader className="text-left">
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDelete(entry)}>Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {entry.activities.map((activity, idx) => (
                          <Badge key={idx} variant="secondary">{activity}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
