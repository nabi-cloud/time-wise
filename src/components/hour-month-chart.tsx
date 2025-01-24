"use client"

import React from 'react';
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import { format, startOfMonth, endOfMonth, isSameMonth } from "date-fns"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface TimeEntry {
    date: string;
    ministryHours: number;
    bibleStudies: number;
    activities: string[];
}

interface MonthlyChartProps {
    selectedDate: Date;
}

const chartConfig = {
    hours: {
        label: "Hours",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig;

export function MonthlyChart({ selectedDate }: MonthlyChartProps) {
    const [totalHours, setTotalHours] = React.useState(0);
    const goalHours = 50; // Monthly goal hours

    React.useEffect(() => {
        const loadMonthlyData = () => {
            if (typeof window === 'undefined') return;

            try {
                const entriesStr = localStorage.getItem('timeEntries');
                if (entriesStr) {
                    const allEntries: TimeEntry[] = JSON.parse(entriesStr);
                    
                    // Filter entries for the selected month
                    const monthEntries = allEntries.filter(entry => 
                        isSameMonth(new Date(entry.date), selectedDate)
                    );

                    // Calculate total hours for the month
                    const total = monthEntries.reduce((sum, entry) => 
                        sum + entry.ministryHours, 0
                    );

                    setTotalHours(total);
                }
            } catch (error) {
                console.error('Error loading monthly data:', error);
            }
        };

        loadMonthlyData();
        
        // Listen for storage changes
        window.addEventListener('storage', loadMonthlyData);
        return () => window.removeEventListener('storage', loadMonthlyData);
    }, [selectedDate]);

    const chartData = [
        { 
            name: "Progress",
            hours: totalHours,
            fill: "hsl(var(--chart-2))",
            progress: 90 + Math.max(1, Math.min(360, (totalHours / goalHours) * 360))
        }
    ];
    
    return (
        <Card className="flex flex-col justify-between col-span-2 md:col-span-1">
            <CardHeader className="items-center pb-0">
                <CardTitle>Total Hours</CardTitle>
                <CardDescription>{format(selectedDate, "MMMM yyyy")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-4 max-h-[290px]">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[260px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={chartData[0].progress}
                        innerRadius={100}
                        outerRadius={180}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        barSize={25}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[112, 86]}
                        />
                        <RadialBar 
                            dataKey="hours" 
                            background
                            cornerRadius={2}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {totalHours}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Hours
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {Math.max(0, goalHours - totalHours)} hours left to reach goal
                </div>
                <div className="leading-none text-center text-muted-foreground">
                    Monthly goal: {goalHours} hours
                </div>
            </CardFooter>
        </Card>
    );
}
