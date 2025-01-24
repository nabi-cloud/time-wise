import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Geist } from "next/font/google"
import { Calendar } from "@/components/ui/calendar"
import { YearlyHoursChart } from "@/components/yearly-hours-chart"
import { YearlyBibleStudiesChart } from "@/components/yearly-bible-studies-chart"
import { YearlyActivityChart } from "@/components/yearly-activity-chart"

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
import { TimeEntry } from "@/types/time-entry"

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

  const calculateYearlyStats = (serviceYear: number) => {
    if (typeof window === 'undefined') return;

    try {
      const entriesStr = localStorage.getItem('timeEntries');
      if (!entriesStr) return;

      const allEntries: TimeEntry[] = JSON.parse(entriesStr);

      // Filter entries for the service year (September previous year to August current year)
      const serviceYearEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.getMonth(); // 0-11 where 0 is January
        const entryYear = entryDate.getFullYear();

        if (entryMonth >= 8) {
          // September-December should be from previous year
          return entryYear === serviceYear - 1;
        } else {
          // January-August should be from service year
          return entryYear === serviceYear;
        }
      });

      // Calculate stats
      const totalHours = serviceYearEntries.reduce((sum, entry) => sum + (entry.ministryHours || 0), 0);
      const totalStudies = serviceYearEntries.reduce((sum, entry) => sum + (entry.bibleStudies || 0), 0);

      // Calculate monthly average using all 12 months of the service year
      const averageHours = totalHours / 12;
      const averageStudies = totalStudies / 12;

      setStats({
        year: serviceYear,
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
    const month = date.getMonth();
    const year = date.getFullYear();
    const serviceYear = month >= 8 ? year + 1 : year;
    calculateYearlyStats(serviceYear);
  }, [date]);

  // Listen for storage changes from other components
  React.useEffect(() => {
    const handleStorageChange = () => {
      const month = date.getMonth();
      const year = date.getFullYear();
      const serviceYear = month >= 8 ? year + 1 : year;
      calculateYearlyStats(serviceYear);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const month = newDate.getMonth();
      const year = newDate.getFullYear();
      const serviceYear = month >= 8 ? year + 1 : year;
      calculateYearlyStats(serviceYear);
    }
  };

  // Get the display year for the button (service year)
  const getDisplayYear = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return month >= 8 ? year + 1 : year;
  };

  return (
    <div className={cn(
      "flex flex-col gap-4",
      geistSans.className,
      "font-sans"
    )}>
      <h1 className="text-2xl font-bold">Yearly Report</h1>
      <div className="flex justify-start gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "max-w-[300px] w-full justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDisplayYear(date)} Service Year
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
        <Button
          variant="outline"
          className={cn("h-10")}
          onClick={() => handleSelect(new Date())}
        >
          Today
        </Button>
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
              {600 - stats.totalMinistryHours} hours left to reach 600 hours
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
      <div className="grid gap-4 grid-cols-1">
        <YearlyHoursChart year={stats.year} />
        <YearlyBibleStudiesChart year={stats.year} />
        <YearlyActivityChart year={stats.year} />
      </div>
    </div>
  )
}
