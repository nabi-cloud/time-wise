import { Calendar, Clipboard, ChartLine, AlarmClockCheck } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Daily",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Monthly",
    url: "#",
    icon: Clipboard,
  },
  {
    title: "Yearly",
    url: "#",
    icon: ChartLine,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2">
          <button className="flex flex-row items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full rounded-md">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><AlarmClockCheck size={20} /></div>
            <div>
              <span className="font-semibold">TimeWise</span>
            </div>
          </button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
