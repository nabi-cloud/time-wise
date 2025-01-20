import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Geist } from "next/font/google";
import { AppProps } from "next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider className={`${geistSans.variable} min-h-screen font-[family-name:var(--font-geist-sans)]`}>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-col flex-1 p-4">
          <header className="flex flex-row items-center gap-2 pb-4 w-full">
            <SidebarTrigger />
            <div data-orientation="vertical" role="none" className="shrink-0 bg-border w-[1px] mr-2 h-4"></div>
          </header>
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarProvider>
  );
}
