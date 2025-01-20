import { Calendar, Clipboard, ChartLine, AlarmClockCheck, Github } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Daily",
    href: "/",
    icon: Calendar,
  },
  {
    title: "Monthly",
    href: "/",
    icon: Clipboard,
  },
  {
    title: "Yearly",
    href: "/",
    icon: ChartLine,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2">
          <Link href="/">
            <button className="flex flex-row items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full rounded-md">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><AlarmClockCheck size={20} /></div>
              <div>
                <span className="font-semibold">TimeWise</span>
              </div>
            </button>
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="https://github.com/nabi-cloud" target="new">
          <button className="flex flex-row items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full rounded-md">
            <div className="flex aspect-square size-5 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground"><Github size={12} /></div>
            <div>
              <span className="text-xs text-gray-400">Nabicloud | 2025</span>
            </div>
          </button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
