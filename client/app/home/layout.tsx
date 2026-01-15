import Topbar from "@/components/home/topbar";
import Sidebar from "@/components/home/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex flex-1 ">
          <Sidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <Topbar />
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
