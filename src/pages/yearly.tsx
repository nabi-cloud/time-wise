import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Geist } from "next/font/google"
import { Calendar } from "@/components/ui/calendar"
import { YearlyChart } from "@/components/yearly-chart"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  activities: string[];
}

interface YearlyStats {
  year: number;
  totalMinistryHours: number;
  totalBibleStudies: number;
  monthlyAverageHours: number;
  monthlyAverageBibleStudies: number;
}

export default function YearlyPage() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [stats, setStats] = React.useState<YearlyStats>({
    year: new Date().getFullYear(),
    totalMinistryHours: 0,
    totalBibleStudies: 0,
    monthlyAverageHours: 0,
    monthlyAverageBibleStudies: 0,
  })

  const calculateYearlyStats = (year: number) => {
    if (typeof window === 'undefined') return;

    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (!entriesStr) return;

      const allEntries: TimeEntry[] = JSON.parse(entriesStr);
      
      // Filter entries for the service year (September previous year to August current year)
      const yearEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.getMonth(); // 0-11 where 0 is January
        const entryYear = entryDate.getFullYear();

        // For months September(8) to December(11), check previous year
        if (entryMonth >= 8) {
          return entryYear === year - 1;
        }
        // For months January(0) to August(7), check current year
        return entryYear === year;
      });

      // Calculate stats
      const totalHours = yearEntries.reduce((sum, entry) => sum + entry.ministryHours, 0);
      const totalStudies = yearEntries.reduce((sum, entry) => sum + entry.bibleStudies, 0);
      
      // Calculate monthly average using all 12 months of the service year
      const averageHours = totalHours / 12;
      const averageStudies = totalStudies / 12;

      setStats({
        year,
        totalMinistryHours: totalHours,
        totalBibleStudies: totalStudies,
        monthlyAverageHours: averageHours,
        monthlyAverageBibleStudies: averageStudies,
      });
    } catch (error) {
      console.error('Error calculating yearly stats:', error);
    }
  };

  // Calculate stats when component mounts and when date changes
  React.useEffect(() => {
    calculateYearlyStats(date.getFullYear());
  }, [date]);

  // Listen for storage changes from other components
  React.useEffect(() => {
    const handleStorageChange = () => {
      calculateYearlyStats(date.getFullYear());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      calculateYearlyStats(newDate.getFullYear());
    }
  };

  return (
    <div className={cn(
      "flex flex-col gap-4",
      geistSans.className,
      "font-sans"
    )}>
      <div className="flex items-center justify-between p-0">
        <div>
          <h1 className="text-2xl font-bold">Yearly Report</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMinistryHours}</div>
            <p className="text-xs text-muted-foreground">
              Hours in ministry this year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyAverageHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average hours per month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bible Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBibleStudies}</div>
            <p className="text-xs text-muted-foreground">
              Total Bible studies conducted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bible Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyAverageBibleStudies.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average Bible studies per month
            </p>
          </CardContent>
        </Card>
      </div>
      <YearlyChart year={stats.year} />
    </div>
  )
}
