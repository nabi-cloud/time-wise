import * as React from "react"
import "@/styles/globals.css";
import { format } from "date-fns"

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { Geist } from "next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import { Minus, Plus, Moon, CalendarIcon } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [ministryHours, setMinistryHours] = React.useState(0);
  const [bibleStudies, setBibleStudies] = React.useState(0);

  return (
    <SidebarProvider className={`${geistSans.variable} min-h-screen font-[family-name:var(--font-geist-sans)]`}>
      <Head>
        <title>Ministry Time Tracker</title>
        <meta name="description" content="Ministry time tracker webapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex flex-row flex-1 justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-6" />
              <button className="flex items-center justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-7 w-7 rounded">
                <Moon size={18} />
              </button>
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="h-7 w-24 text-xs font">
                  <Plus color="#ffffff" /> Add Time
                </Button>
              </DrawerTrigger>
              <DrawerContent className={geistSans.className}>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader className="flex flex-col items-center justify-center gap-4">
                    {/* Date Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* Multiselect for Ministry Avenue */}
                    <Select multiple>
                      <SelectTrigger className="w-[280px] text-center">
                        <SelectValue placeholder="Type of Ministry" />
                      </SelectTrigger>
                      <SelectContent className={geistSans.className}>
                        <SelectItem value="house">House to House</SelectItem>
                        <SelectItem value="study">Bible Study</SelectItem>
                        <SelectItem value="rv">Return Visit</SelectItem>
                        <SelectItem value="cart">Cart Witnessing</SelectItem>
                        <SelectItem value="letter">Letter Writing</SelectItem>
                        <SelectItem value="informal">Informal Witnessing</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </DrawerHeader>
                  <div className="p-4 pb-4 space-y-4">
                    {/* Hours in the Ministry */}
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setMinistryHours(Math.max(0, ministryHours - 1))}
                        disabled={ministryHours <= 0}
                      >
                        <Minus />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-xl font-bold tracking-tighter">
                          {ministryHours}
                        </div>
                        <div className="text-[0.70rem] text-muted-foreground">
                          Hours
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setMinistryHours(Math.min(24, ministryHours + 1))}
                        disabled={ministryHours >= 24}
                      >
                        <Plus />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                    {/* Bible Studies */}
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setBibleStudies(Math.max(0, bibleStudies - 1))}
                        disabled={bibleStudies <= 0}
                      >
                        <Minus />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-xl font-bold tracking-tighter">
                          {bibleStudies}
                        </div>
                        <div className="text-[0.70rem] text-muted-foreground">
                          Bible Studies
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setBibleStudies(Math.min(99, bibleStudies + 1))}
                        disabled={bibleStudies >= 99}
                      >
                        <Plus />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </div>
                  <DrawerFooter className="pb-10">
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMinistryHours(0);
                          setBibleStudies(0);
                        }}
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Component {...pageProps} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
