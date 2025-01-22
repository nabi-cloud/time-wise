"use client"

import React from 'react';
import { format, isSameMonth } from "date-fns"
import { BookOpen } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface TimeEntry {
    date: string;
    bibleStudies: number;
}

interface BibleStudiesCardProps {
    selectedDate: Date;
}

export function BibleStudiesCard({ selectedDate }: BibleStudiesCardProps) {
    const [totalStudies, setTotalStudies] = React.useState(0);

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

                    // Calculate total Bible studies for the month
                    const total = monthEntries.reduce((sum, entry) =>
                        sum + entry.bibleStudies, 0
                    );

                    setTotalStudies(total);
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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-semibold">Bible Studies</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='space-y-4'>
                <p className="text-xs text-muted-foreground">
                    {format(selectedDate, "MMMM yyyy")}
                </p>
                <div className="text-4xl font-bold">{totalStudies}</div>
            </CardContent>
        </Card>
    );
}
