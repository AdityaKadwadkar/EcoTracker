import { Link, useLocation } from "react-router-dom";
import { Zap, Droplets, Recycle, BarChart3, Home, LogOut, LogIn, Loader2, Sparkles, User, Settings, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { user, loading, signOut, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const initials = user?.name?.[0] ?? user?.email?.[0] ?? "E";

  const navItems = [
    { path: "/energy", label: "Energy", icon: Zap, color: "text-amber-500" },
    { path: "/water", label: "Water", icon: Droplets, color: "text-sky-500" },
    { path: "/waste", label: "Waste", icon: Recycle, color: "text-emerald-500" },
    { path: "/analytics", label: "Analytics", icon: BarChart3, color: "text-indigo-500" },
  ];

  return (
    <nav className="glass-nav">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">EcoTrack</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 dark:bg-black/20 p-1.5 rounded-2xl border border-white/10">
            {navItems.map(({ path, label, icon: Icon, color }) => (
              <Button
                key={path}
                asChild
                variant="ghost"
                className={cn(
                  "relative px-4 py-2 h-9 rounded-xl transition-all duration-300",
                  location.pathname === path
                    ? "bg-white dark:bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
                )}
              >
                <Link to={path} className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4 transition-transform duration-300", location.pathname === path && "scale-110", color)} />
                  <span className="text-sm font-medium tracking-wide">{label}</span>
                  {location.pathname === path && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-1 pl-1 pr-3 rounded-full hover:bg-white/50 dark:hover:bg-white/5 border border-transparent hover:border-white/20 transition-all duration-300">
                      <Avatar className="h-8 w-8 border-2 border-primary/20 shadow-md">
                        <AvatarImage src={user.avatarUrl ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start leading-none">
                        <span className="text-sm font-semibold">{user.name?.split(' ')[0] ?? "Member"}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pro</span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl glass-card">
                    <DropdownMenuLabel className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl ?? undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-bold text-base leading-none">{user.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem asChild className="rounded-xl py-3 focus:bg-primary/5 cursor-pointer">
                      <Link to="/analytics" className="flex items-center gap-3">
                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">Performance Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl py-3 focus:bg-primary/5 cursor-pointer">
                      <Link to="/energy" className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Energy Grid</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="opacity-50" />
                    <DropdownMenuItem
                      className="rounded-xl py-3 text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer flex items-center gap-3"
                      onSelect={async () => {
                        try {
                          await signOut();
                          toast({ title: "Logged out", description: "Your session has ended safely." });
                        } catch {
                          toast({ title: "Error", description: "Failed to log out.", variant: "destructive" });
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => signInWithGoogle(location.pathname)}
                className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            )}

            {/* Mobile Menu Trigger (Simplified for Redesign) */}
            <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
              <ArrowRight className="h-5 w-5 rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Re-defining Leaf since it might be missing from previous imports
import { Leaf } from "lucide-react";

export default Navbar;
