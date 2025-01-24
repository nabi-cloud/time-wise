"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
import { useMemo } from "react"

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

interface ActivityChartProps {
  entries: {
    bibleStudy: boolean;
    returnVisit: boolean;
    houseToHouse: boolean;
    cartWitnessing: boolean;
    letterWriting: boolean;
    informalWitnessing: boolean;
    others: boolean;
  }[];
}

export function ActivityChart({ entries = [] }: ActivityChartProps) {
  const data = useMemo(() => {
    const activityCounts = entries.reduce((acc, entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        if (value === true) {
          acc[key] = (acc[key] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    return chartData.map(item => ({
      ...item,
      count: activityCounts[item.id] || 0,
    }));
  }, [entries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Ministry Activities</CardDescription>
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
          Showing total count a type of ministry is tagged
        </div>
      </CardFooter>
    </Card>
  );
}
