import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, Link as LinkIcon, Settings, LogOut, ExternalLink, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/links", label: "Links", icon: LinkIcon },
    { href: "/dashboard/profile", label: "Appearance", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tighter font-display text-primary neon-text">
          VOIDLINK
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            location === item.href 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}>
              <item.icon className="w-5 h-5" />
              {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50 space-y-2">
        {user?.username && (
          <a 
            href={`/${user.username}`} 
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs font-medium transition-colors mb-2"
          >
            View Live Page <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 z-50">
        <NavContent />
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold font-display text-primary">VOIDLINK</Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-12 pt-20 lg:pt-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
