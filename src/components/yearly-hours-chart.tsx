import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { TimeEntry } from "@/types/time-entry"

// Function to get total hours for a specific month
type MonthName = 
  | "September" | "October" | "November" | "December" | "January" | "February"
  | "March" | "April" | "May" | "June" | "July" | "August";

interface YearlyChartProps {
  year: number;
}

function getServiceYearMonthYear(month: MonthName, serviceYear: number): { month: number, year: number } {
  const monthNumbers: { [key in MonthName]: number } = {
    "September": 8, "October": 9, "November": 10, "December": 11,
    "January": 0, "February": 1, "March": 2, "April": 3,
    "May": 4, "June": 5, "July": 6, "August": 7
  };

  const monthNumber = monthNumbers[month];
  // If month is September-December, it's in the previous calendar year
  const year = monthNumber >= 8 ? serviceYear - 1 : serviceYear;
  
  return { month: monthNumber, year };
}

function getMonthHours(entries: TimeEntry[], month: MonthName, serviceYear: number): number {
  try {
    if (!entries) return 0;

    const { month: targetMonth, year: targetYear } = getServiceYearMonthYear(month, serviceYear);

    // Filter entries for the specific month and year, then sum up the hours
    return entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === targetMonth && 
               entryDate.getFullYear() === targetYear;
      })
      .reduce((total, entry) => total + (entry.ministryHours || 0), 0);
  } catch (error) {
    console.error('Error calculating hours for month:', error);
    return 0;
  }
}

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function YearlyHoursChart({ year }: YearlyChartProps) {
  const [timeEntries, setTimeEntries] = React.useState<TimeEntry[]>([]);

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('timeEntries');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTimeEntries(parsedData);
      }
    } catch (error) {
      console.error('Error loading time data:', error);
    }
  }, []);

  React.useEffect(() => {
    const handleStorageChange = () => {
      const storedData = localStorage.getItem('timeEntries');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTimeEntries(parsedData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const firstHalfData = [
    { month: "September", hours: getMonthHours(timeEntries, "September", year) },
    { month: "October", hours: getMonthHours(timeEntries, "October", year) },
    { month: "November", hours: getMonthHours(timeEntries, "November", year) },
    { month: "December", hours: getMonthHours(timeEntries, "December", year) },
    { month: "January", hours: getMonthHours(timeEntries, "January", year) },
    { month: "February", hours: getMonthHours(timeEntries, "February", year) }
  ];

  const secondHalfData = [
    { month: "March", hours: getMonthHours(timeEntries, "March", year) },
    { month: "April", hours: getMonthHours(timeEntries, "April", year) },
    { month: "May", hours: getMonthHours(timeEntries, "May", year) },
    { month: "June", hours: getMonthHours(timeEntries, "June", year) },
    { month: "July", hours: getMonthHours(timeEntries, "July", year) },
    { month: "August", hours: getMonthHours(timeEntries, "August", year) }
  ];

  const renderChart = (data: typeof firstHalfData, title: string) => (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-xl">Hour Overview</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="hours" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={12}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="hours" fill="var(--color-hours)" radius={5}>
              <LabelList
                dataKey="hours"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderChart(firstHalfData, "September - February")}
      {renderChart(secondHalfData, "March - August")}
    </div>
  );
}
