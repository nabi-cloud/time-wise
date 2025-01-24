import { Button } from "@/components/ui/button";
import { Pencil, CalendarIcon, Sprout, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner"
import { TimeEntry } from "@/types/time-entry";

import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface EditButtonProps {
  entry: TimeEntry;
  onSave: (updatedEntry: Omit<TimeEntry, 'date'> & { date: Date }) => void;
}

export function EditButton({ entry, onSave }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(parseISO(entry.date));
  const [ministryHours, setMinistryHours] = useState(entry.ministryHours || 0);
  const [bibleStudies, setBibleStudies] = useState(entry.bibleStudies || 0);
  const [houseToHouse, setHouseToHouse] = useState(entry.houseToHouse === true);
  const [bibleStudy, setBibleStudy] = useState(entry.bibleStudy === true);
  const [returnVisit, setReturnVisit] = useState(entry.returnVisit === true);
  const [cartWitnessing, setCartWitnessing] = useState(entry.cartWitnessing === true);
  const [letterWriting, setLetterWriting] = useState(entry.letterWriting === true);
  const [informalWitnessing, setInformalWitnessing] = useState(entry.informalWitnessing === true);
  const [others, setOthers] = useState(entry.others === true);
  const [error, setError] = useState<string | null>(null);

  // Reset state when entry changes
  useEffect(() => {
    setDate(parseISO(entry.date));
    setMinistryHours(entry.ministryHours || 0);
    setBibleStudies(entry.bibleStudies || 0);
    setHouseToHouse(entry.houseToHouse === true);
    setBibleStudy(entry.bibleStudy === true);
    setReturnVisit(entry.returnVisit === true);
    setCartWitnessing(entry.cartWitnessing === true);
    setLetterWriting(entry.letterWriting === true);
    setInformalWitnessing(entry.informalWitnessing === true);
    setOthers(entry.others === true);
    setError(null);
  }, [entry]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const getSelectedMinistryCount = () => {
    return [houseToHouse, bibleStudy, returnVisit, cartWitnessing, letterWriting, informalWitnessing, others]
      .filter(Boolean).length;
  };

  const handleSubmit = () => {
    if (!date) {
      setError("Please select a date");
      return;
    }

    if (ministryHours <= 0) {
      setError("Add hours spent in the ministry");
      return;
    }

    if (getSelectedMinistryCount() === 0) {
      setError("Select at least one type of ministry");
      return;
    }

    // Calculate activities based on selected options
    const activities: string[] = [];
    if (houseToHouse) activities.push("House to House");
    if (bibleStudy) activities.push("Bible Study");
    if (returnVisit) activities.push("Return Visit");
    if (cartWitnessing) activities.push("Cart Witnessing");
    if (letterWriting) activities.push("Letter Writing");
    if (informalWitnessing) activities.push("Informal Witnessing");
    if (others) activities.push("Others");

    const updatedEntry = {
      date,
      ministryHours,
      bibleStudies,
      houseToHouse,
      bibleStudy,
      returnVisit,
      cartWitnessing,
      letterWriting,
      informalWitnessing,
      others,
      activities
    };

    onSave(updatedEntry);
    setOpen(false);

    toast.success("Time entry updated");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="h-8 w-8 px-0" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className={cn(geistSans.className, "w-[300px] lg:w-[400px] rounded-lg")}>
        <DialogHeader>
          <DialogTitle>Edit Time</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
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
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Sprout className="mr-2 h-4 w-4" />
                Type of Ministry{getSelectedMinistryCount() > 0 ? ` (${getSelectedMinistryCount()})` : ''}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={geistSans.className + " w-[280px]"}>
              <DropdownMenuLabel>Select items that apply</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={houseToHouse} onCheckedChange={setHouseToHouse}>
                House to House
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={bibleStudy} onCheckedChange={setBibleStudy}>
                Bible Study
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={returnVisit} onCheckedChange={setReturnVisit}>
                Return Visit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={cartWitnessing} onCheckedChange={setCartWitnessing}>
                Cart Witnessing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={letterWriting} onCheckedChange={setLetterWriting}>
                Letter Writing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={informalWitnessing} onCheckedChange={setInformalWitnessing}>
                Informal Witnessing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={others} onCheckedChange={setOthers}>
                Others
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="space-y-4">
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
        <DialogFooter className="mt-6">
          {error && (
            <div className="text-red-500 text-sm mb-2">
              {error}
            </div>
          )}
          <div className="flex fex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
