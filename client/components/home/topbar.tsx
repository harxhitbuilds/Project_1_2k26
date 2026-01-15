"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggle from "../theme/mode-toggle";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <ModeToggle />
    </header>
  );
}
