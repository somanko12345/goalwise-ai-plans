
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobile={isMobile} />
      <div className={`flex-1 ${isMobile ? "" : "md:pl-64"}`}>
        <main className="flex-1 p-4 md:p-6">
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Sidebar isMobile={true} />
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
