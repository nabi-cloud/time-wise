import { Separator } from "@/components/ui/separator";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="text-left grid grid-cols-4 gap-4">
      <div className="space-y-6 col-span-4 md:col-span-3">
        <h1 className="text-3xl font-bold">Welcome to TimeWise</h1>
        <blockquote className="text-sm italic text-gray-300">
          <p>"So keep strict watch that how you walk is not as unwise but as wise persons,  making the best use of your time." —Eph. 5:15, 16</p>
        </blockquote>
        <p>As an aid to help you reach your goal as a regular pioneer, TimeWise was created to keep track of your time spent in the ministry. Please take the time to read this guide to utilize all the features this webapp can offer.</p>
        <Separator />
        <h2 className="text-2xl font-bold">Important Reminders</h2>
        <h3 className="text-xl font-bold">How your data is stored</h3>
        <p>For simplicity and due to time constraints, this webapp is not connected to a database, which means your data is not shared or accessible from anywhere else (not even the developer of this webapp). Where is it stored? It is stored in your browser's local storage.</p>
      </div>
    </div>
  );
}
