import Navbar from "@/components/global/navigation/navbar";
import Background from "@/components/land/background";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      {children}
    </div>
  );
}
