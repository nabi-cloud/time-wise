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

// Function to get total bible studies for a specific month
type MonthName = 
  | "September" | "October" | "November" | "December" | "January" | "February"
  | "March" | "April" | "May" | "June" | "July" | "August";

interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  activities: string[];
}

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

function getMonthBibleStudies(entries: TimeEntry[], month: MonthName, serviceYear: number): number {
  try {
    if (!entries) return 0;

    const { month: targetMonth, year: targetYear } = getServiceYearMonthYear(month, serviceYear);

    // Filter entries for the specific month and year, then sum up the bible studies
    return entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === targetMonth && 
               entryDate.getFullYear() === targetYear;
      })
      .reduce((total, entry) => total + (entry.bibleStudies || 0), 0);
  } catch (error) {
    console.error('Error calculating bible studies for month:', error);
    return 0;
  }
}

const chartConfig = {
  studies: {
    label: "Bible Studies",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function YearlyBibleStudiesChart({ year }: YearlyChartProps) {
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
    { month: "September", studies: getMonthBibleStudies(timeEntries, "September", year) },
    { month: "October", studies: getMonthBibleStudies(timeEntries, "October", year) },
    { month: "November", studies: getMonthBibleStudies(timeEntries, "November", year) },
    { month: "December", studies: getMonthBibleStudies(timeEntries, "December", year) },
    { month: "January", studies: getMonthBibleStudies(timeEntries, "January", year) },
    { month: "February", studies: getMonthBibleStudies(timeEntries, "February", year) }
  ];

  const secondHalfData = [
    { month: "March", studies: getMonthBibleStudies(timeEntries, "March", year) },
    { month: "April", studies: getMonthBibleStudies(timeEntries, "April", year) },
    { month: "May", studies: getMonthBibleStudies(timeEntries, "May", year) },
    { month: "June", studies: getMonthBibleStudies(timeEntries, "June", year) },
    { month: "July", studies: getMonthBibleStudies(timeEntries, "July", year) },
    { month: "August", studies: getMonthBibleStudies(timeEntries, "August", year) }
  ];

  const renderChart = (data: typeof firstHalfData, title: string) => (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-xl">Bible Studies Overview</CardTitle>
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
            <XAxis type="number" dataKey="studies" hide />
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
            <Bar dataKey="studies" fill="var(--color-studies)" radius={5}>
              <LabelList
                dataKey="studies"
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
