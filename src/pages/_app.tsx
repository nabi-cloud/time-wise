import * as React from "react"
import "@/styles/globals.css";
import { format } from "date-fns"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { Geist } from "next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import { Minus, Plus, Moon, CalendarIcon } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  activities: string[];
}

export default function App({ Component, pageProps }: AppProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [ministryHours, setMinistryHours] = React.useState(0);
  const [bibleStudies, setBibleStudies] = React.useState(0);
  const [houseToHouse, setHouseToHouse] = React.useState<Checked>(false)
  const [bibleStudy, setBibleStudy] = React.useState<Checked>(false)
  const [returnVisit, setReturnVisit] = React.useState<Checked>(false)
  const [cartWitnessing, setCartWitnessing] = React.useState<Checked>(false)
  const [letterWriting, setLetterWriting] = React.useState<Checked>(false)
  const [informalWitnessing, setInformalWitnessing] = React.useState<Checked>(false)
  const [others, setOthers] = React.useState<Checked>(false)
  const [open, setOpen] = React.useState(false)

  const handleSubmit = () => {
    if (!date || typeof window === 'undefined') return;

    const activities = [
      houseToHouse && 'House to House',
      bibleStudy && 'Bible Study',
      returnVisit && 'Return Visit',
      cartWitnessing && 'Cart Witnessing',
      letterWriting && 'Letter Writing',
      informalWitnessing && 'Informal Witnessing',
      others && 'Others'
    ].filter(Boolean) as string[];

    const entry: TimeEntry = {
      date: date.toISOString(),
      ministryHours,
      bibleStudies,
      activities
    };

    try {
      // Get existing entries
      const existingEntriesStr = localStorage.getItem('timeEntries');
      const existingEntries: TimeEntry[] = existingEntriesStr ? JSON.parse(existingEntriesStr) : [];

      // Add new entry
      const updatedEntries = [...existingEntries, entry];
      localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));

      // Reset form
      setMinistryHours(0);
      setBibleStudies(0);
      setHouseToHouse(false);
      setBibleStudy(false);
      setReturnVisit(false);
      setCartWitnessing(false);
      setLetterWriting(false);
      setInformalWitnessing(false);
      setOthers(false);
      setOpen(false);

      // Force reload entries in daily page
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

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
            <Drawer open={open} onOpenChange={setOpen}>
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
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">Type of Ministry</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={geistSans.className + " w-[280]"}>
                        <DropdownMenuLabel>Select items that apply</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={houseToHouse}
                          onCheckedChange={setHouseToHouse}
                        >
                          House to House
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={bibleStudy}
                          onCheckedChange={setBibleStudy}
                        >
                          Bible Study
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={returnVisit}
                          onCheckedChange={setReturnVisit}
                        >
                          Return Visit
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={cartWitnessing}
                          onCheckedChange={setCartWitnessing}
                        >
                          Cart Witnessing
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={letterWriting}
                          onCheckedChange={setLetterWriting}
                        >
                          Letter Writing
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={informalWitnessing}
                          onCheckedChange={setInformalWitnessing}
                        >
                          Informal Witnessing
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={others}
                          onCheckedChange={setOthers}
                        >
                          Others
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DrawerHeader>
                  <div className="p-4">
                    {/* Hours in the Ministry */}
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setMinistryHours(Math.max(0, ministryHours - 1))}
                        disabled={ministryHours <= 0}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold tracking-tighter">
                          {ministryHours}
                        </div>
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                          Hours
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => setMinistryHours(ministryHours + 1)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                    {/* Bible Studies */}
                    <div className="mt-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => setBibleStudies(Math.max(0, bibleStudies - 1))}
                          disabled={bibleStudies <= 0}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold tracking-tighter">
                            {bibleStudies}
                          </div>
                          <div className="text-[0.70rem] uppercase text-muted-foreground">
                            Bible Studies
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => setBibleStudies(bibleStudies + 1)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter className="mb-6">
                    <Button onClick={handleSubmit}>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
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
