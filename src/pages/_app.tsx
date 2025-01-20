import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/AppSidebar"
import { Geist } from "next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Plus, Moon } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
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
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <Button variant="ghost">
              <Moon size={18} />
            </Button>
            <Button className="h-8">
              <Plus /> Add Time
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Component {...pageProps} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
