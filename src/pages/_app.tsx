import * as React from "react"
import "@/styles/globals.css";
import { format } from "date-fns"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { registerServiceWorker } from "@/utils/pwaRegistration";
import { Analytics } from "@vercel/analytics/react"

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Geist } from "next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import { Minus, Plus, CalendarIcon, Sprout } from 'lucide-react';
import { ThemeProvider } from "next-themes"
import { ModeSwitcher } from "@/components/mode-switcher"
import { TimeEntry, createActivitiesArray } from "@/types/time-entry"
import { safeSetItem, getStorageUsagePercentage } from '../utils/storageUtils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type Checked = DropdownMenuCheckboxItemProps["checked"]

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
  const [error, setError] = React.useState<string | null>(null);

  // Reset all form values when drawer closes or route changes
  React.useEffect(() => {
    if (!open) {
      setDate(new Date());
      setMinistryHours(0);
      setBibleStudies(0);
      setHouseToHouse(false);
      setBibleStudy(false);
      setReturnVisit(false);
      setCartWitnessing(false);
      setLetterWriting(false);
      setInformalWitnessing(false);
      setOthers(false);
      setError(null);
    }
  }, [open]);

  React.useEffect(() => {
    // Reset date to current date when route changes
    setDate(new Date());
  }, [Component]);

  React.useEffect(() => {
    registerServiceWorker();
  }, []);

  const getSelectedMinistryCount = () => {
    return [houseToHouse, bibleStudy, returnVisit, cartWitnessing, 
            letterWriting, informalWitnessing, others].filter(Boolean).length;
  };

  const hasSelectedMinistryType = () => {
    return getSelectedMinistryCount() > 0;
  };

  const handleSubmit = () => {
    // Reset error state
    setError(null);

    // Validate required fields
    if (!date) {
      setError("Please select a date");
      return;
    }

    if (ministryHours <= 0) {
      setError("Add hours spent in the ministry");
      return;
    }

    if (!hasSelectedMinistryType()) {
      setError("Select at least one type of ministry");
      return;
    }

    if (typeof window === 'undefined') return;

    const activities = createActivitiesArray({
      date: date.toISOString(),
      ministryHours,
      bibleStudies,
      houseToHouse: !!houseToHouse,
      bibleStudy: !!bibleStudy,
      returnVisit: !!returnVisit,
      cartWitnessing: !!cartWitnessing,
      letterWriting: !!letterWriting,
      informalWitnessing: !!informalWitnessing,
      others: !!others,
      activities: []
    });

    const entry: TimeEntry = {
      date: date.toISOString(),
      ministryHours,
      bibleStudies,
      houseToHouse: !!houseToHouse,
      bibleStudy: !!bibleStudy,
      returnVisit: !!returnVisit,
      cartWitnessing: !!cartWitnessing,
      letterWriting: !!letterWriting,
      informalWitnessing: !!informalWitnessing,
      others: !!others,
      activities
    };

    try {
      // Get existing entries
      const existingEntriesStr = localStorage.getItem('timeEntries');
      const existingEntries: TimeEntry[] = existingEntriesStr ? JSON.parse(existingEntriesStr) : [];

      // Add new entry at the beginning of the array
      const updatedEntries = [entry, ...existingEntries];

      // Calculate and log the size of the new entry
      const entrySizeInBytes = new TextEncoder().encode(JSON.stringify(entry)).length;
      console.log(`New entry added - Size: ${entrySizeInBytes} bytes`, entry);

      // Log total storage size after addition
      const totalStorageSizeInBytes = new TextEncoder().encode(JSON.stringify(updatedEntries)).length;
      console.log(`Total storage size: ${totalStorageSizeInBytes} bytes`);
      
      // Use the safe storage method
      if (!safeSetItem('timeEntries', JSON.stringify(updatedEntries))) {
        return; // Exit if storage failed
      }

      // Show storage usage warning if getting close to limit
      const usagePercentage = getStorageUsagePercentage();
      if (usagePercentage > 80) {
        toast.warning(`Storage is ${usagePercentage.toFixed(1)}% full. Consider backing up your data.`);
      }

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
      setError(null);

    } catch (err) {
      setError("Failed to save entry. Please try again.");
      console.error("Error saving entry:", err);
    }

    toast.success("Time entry saved");
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider className={`${geistSans.variable} min-h-screen font-[family-name:var(--font-geist-sans)]`}>
        <Head>
          <title>TimeWise</title>
          <meta name="description" content="Manage your time efficiently with TimeWise" />
          <meta property="og:title" content="TimeWise" />
          <meta property="og:description" content="Manage your time efficiently with TimeWise" />
          <meta property="og:image" content="/og-image.png" />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="640" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="TimeWise" />
          <meta name="twitter:description" content="Manage your time efficiently with TimeWise" />
          <meta name="twitter:image" content="/og-image.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-row flex-1 justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-6" />
                <ModeSwitcher />
              </div>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button className="h-7 w-24 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-1 h-4 w-4" /> Add Time
                  </Button>
                </DrawerTrigger>
                <DrawerContent className={geistSans.className}>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="flex flex-col items-center justify-center gap-4">
                      {/* Date Picker */}
                      <Popover>
                        <DrawerTitle>Add Time</DrawerTitle>
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
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Sprout className="mr-2 h-4 w-4" /> 
                            Type of Ministry{getSelectedMinistryCount() > 0 ? ` (${getSelectedMinistryCount()})` : ''}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={geistSans.className + " w-[280px]"}>
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
                      {error && (
                        <div className="text-red-500 text-sm mb-2">
                          {error}
                        </div>
                      )}
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
            <Analytics />
            <Toaster richColors closeButton  />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
