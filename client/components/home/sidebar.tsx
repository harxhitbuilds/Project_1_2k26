"use client";
import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSidebarConfig } from "@/config/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { navConfig } from "@/config/navbar";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const SidebarToggle = () => {
  const { isMobile, open, toggleSidebar } = useSidebar();

  if (isMobile) {
    return null;
  }

  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className="size-7"
    >
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
};

export default function Sidebar() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarConfig = getSidebarConfig(session);

  const handleLogout = async () => {
    setIsLoading(true);
    toast.info("Logging you out...");
    await logout();
  };

  return (
    <UiSidebar collapsible="icon" className="bg-background border-r">
      <SidebarHeader className="flex items-center justify-between group-data-[state=collapsed]:justify-center px-4 py-6 ">
        <div className="flex items-center gap-2 group-data-[state=collapsed]:hidden">
          <Image
            src={navConfig.logo.src}
            alt={navConfig.logo.src}
            height={20}
            width={20}
            className="dark:invert"
          />
          <h1 className="pb-1 font-semibold text-lg">{navConfig.product}</h1>
        </div>
        <SidebarToggle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarConfig.sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[10px] italic">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.links.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.link} passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.link}
                      tooltip={item.label}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full items-center justify-start gap-2 p-2"
            >
              <Image
                src={session?.user?.profile ?? "/avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium">
                  {session?.user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.username}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="top" align="start">
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              {isLoading ? (
                <Spinner className="h-5 w-5 animate-spin" />
              ) : (
                "Logout"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </UiSidebar>
  );
}
