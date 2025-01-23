"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { type: "HH", id: "houseToHouse", count: 0, fill: "hsl(var(--chart-1))" },
  { type: "BS", id: "bibleStudy", count: 0, fill: "hsl(var(--chart-2))" },
  { type: "RV", id: "returnVisit", count: 0, fill: "hsl(var(--chart-3))" },
  { type: "CW", id: "cartWitnessing", count: 0, fill: "hsl(var(--chart-4))" },
  { type: "LW", id: "letterWriting", count: 0, fill: "hsl(var(--chart-5))" },
  { type: "IW", id: "informalWitnessing", count: 0, fill: "hsl(var(--chart-1))" },
  { type: "...", id: "others", count: 0, fill: "hsl(var(--chart-2))" }
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface YearlyActivityChartProps {
  year: number;
}

export function YearlyActivityChart({ year }: YearlyActivityChartProps) {
  const [timeEntries, setTimeEntries] = useState<{
    date: string;
    bibleStudy: boolean;
    returnVisit: boolean;
    houseToHouse: boolean;
    cartWitnessing: boolean;
    letterWriting: boolean;
    informalWitnessing: boolean;
    others: boolean;
  }[]>([]);

  useEffect(() => {
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

  useEffect(() => {
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

  const data = useMemo(() => {
    const activityCounts = timeEntries.reduce((acc, entry) => {
      // Check if the entry is within the service year (September to August)
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();
      const isInServiceYear = 
        (entryMonth >= 8 && entryYear === year - 1) || // September to December of previous year
        (entryMonth <= 7 && entryYear === year);      // January to August of current year

      if (isInServiceYear) {
        Object.entries(entry).forEach(([key, value]) => {
          if (key !== 'date' && value === true) {
            acc[key] = (acc[key] || 0) + 1;
          }
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return chartData.map(item => ({
      ...item,
      count: activityCounts[item.id] || 0,
    }));
  }, [timeEntries, year]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Activity Overview</CardTitle>
        <CardDescription>{`Service Year ${year-1}/${year}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total count a type of ministry is tagged for the service year
        </div>
      </CardFooter>
    </Card>
  );
}
