
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  MessageSquarePlus, 
  Settings, 
  Target, 
  TrendingUp 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isMobile?: boolean;
}

export function Sidebar({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return <MobileSidebar />;
  }
  
  return <DesktopSidebar />;
}

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col bg-sidebar">
        <SidebarNav isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}

function DesktopSidebar() {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar fixed">
      <SidebarNav />
    </div>
  );
}

function SidebarNav({ isMobile = false, className }: SidebarNavProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-primary"
    },
    {
      title: "Goals",
      icon: Target,
      href: "/goals",
      color: "text-primary"
    },
    {
      title: "Budget",
      icon: CreditCard,
      href: "/budget",
      color: "text-primary"
    },
    {
      title: "Investments",
      icon: TrendingUp,
      href: "/investments",
      color: "text-primary"
    },
    {
      title: "Insights",
      icon: MessageSquarePlus,
      href: "/insights",
      color: "text-primary"
    }
  ];

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <Sparkles className="h-6 w-6" />
          <span className="text-xl font-bold">GoalSage</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 gap-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-foreground",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar>
            <AvatarFallback>
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">User ID: {user?.id?.substring(0, 8)}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

