import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Zap, Droplets, Recycle, Filter, Download, RefreshCcw, Search, Activity, Calendar, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type EcoFilter = "all" | "energy" | "water" | "waste";

const Analytics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState<EcoFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<
    Array<{
      id: string;
      date: Date;
      type: "energy" | "water" | "waste";
      title: string;
      content: string;
      category: string;
    }>
  >([]);

  const loadEntries = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        const mapped = data.map((entry: any) => {
          let type: "energy" | "water" | "waste" = "energy";
          if (["domestic", "industrial", "irrigation", "water"].includes(entry.category)) type = "water";
          else if (["recycling", "composting", "landfill", "waste"].includes(entry.category)) type = "waste";
          else if (["grid", "solar", "battery", "energy"].includes(entry.category)) type = "energy";

          let title = "";
          if (type === "energy") title = `Energy Grid Output`;
          else if (type === "water") title = `Hydraulic System Audit`;
          else title = `Circular Mass Balance`;

          return {
            id: entry.id,
            date: new Date(entry.created_at),
            type,
            title,
            content: entry.entry_text,
            category: entry.category.charAt(0).toUpperCase() + entry.category.slice(1),
          };
        });
        setEntries(mapped);
      }
    } catch (error) {
      toast({ title: "Telemtry Error", description: "Failed to pull analysis streams.", variant: "destructive" });
    }
  }, [toast, user]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const filteredEntries = useMemo(() => {
    const byType = filter === "all" ? entries : entries.filter((entry) => entry.type === filter);
    if (!searchTerm.trim()) return byType;
    const query = searchTerm.toLowerCase();
    return byType.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query),
    );
  }, [entries, filter, searchTerm]);

  const stats = useMemo(
    () => [
      { label: "Aggregate Logs", value: entries.length, icon: BarChart3, color: "text-primary" },
      { label: "Energy Vector", value: entries.filter((e) => e.type === "energy").length, icon: Zap, color: "text-amber-500" },
      { label: "Liquid Cycle", value: entries.filter((e) => e.type === "water").length, icon: Droplets, color: "text-sky-500" },
      { label: "Solid Waste", value: entries.filter((e) => e.type === "waste").length, icon: Recycle, color: "text-emerald-500" },
    ],
    [entries],
  );

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                <Activity className="h-3 w-3" /> System Wide Monitoring
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic">Control Center</h1>
              <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                Centralized telemetry panel for auditing your environmental performance vectors.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-12 px-6 rounded-xl glass-card gap-2 font-bold" onClick={loadEntries}>
                <RefreshCcw className="h-4 w-4" /> REFRESH STREAMS
              </Button>
              <Button className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                <Download className="h-4 w-4 mr-2" /> EXPORT AUDIT
              </Button>
            </div>
          </header>

          {/* KPI Dashboard */}
          <div className="mb-16 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="glass-card border-none rounded-[2rem] p-8 transition-all hover:scale-[1.03] duration-300">
                <div className="flex flex-col gap-6">
                  <div className={cn("p-3 rounded-2xl w-fit bg-foreground/5", color)}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</h4>
                    <p className="text-4xl font-black italic tracking-tighter">{value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Controls */}
            <aside className="lg:col-span-4 space-y-8">
              <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden sticky top-24">
                <CardHeader className="bg-foreground/5 p-8 border-b border-white/10 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 opacity-40" /> Filters
                  </CardTitle>
                  {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-[10px] font-bold opacity-50 uppercase">Clear</Button>}
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Stream Search</Label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search telemetry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-14 pl-12 rounded-[1.25rem] border-none glass-card font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Vector Category</Label>
                    <div className="flex flex-col gap-2">
                      {["all", "energy", "water", "waste"].map((v) => (
                        <button
                          key={v}
                          onClick={() => setFilter(v as any)}
                          className={cn(
                            "flex items-center justify-between px-6 py-4 rounded-2xl font-bold uppercase tracking-tighter text-sm transition-all",
                            filter === v
                              ? "bg-foreground text-background scale-[1.02] shadow-xl"
                              : "glass-card hover:bg-white/10 opacity-70 hover:opacity-100"
                          )}
                        >
                          {v}
                          {filter === v && <ArrowUpRight className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Content Area */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Audit Timeline</h2>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="glass-card rounded-[2.5rem] p-20 text-center">
                  <Activity className="h-16 w-16 mx-auto mb-8 text-muted-foreground/20" />
                  <p className="text-muted-foreground text-lg font-bold italic">No telemetry matches your current control parameters.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEntries.map((entry) => (
                    <Card key={entry.id} className="glass-card border-none rounded-[2rem] overflow-hidden group hover:bg-white/5 transition-all duration-300">
                      <CardHeader className="p-8 flex flex-row items-center gap-6">
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                          entry.type === 'energy' ? 'bg-amber-500/20 text-amber-500' :
                            entry.type === 'water' ? 'bg-sky-500/20 text-sky-500' :
                              'bg-emerald-500/20 text-emerald-500'
                        )}>
                          {entry.type === 'energy' ? <Zap className="h-6 w-6" /> :
                            entry.type === 'water' ? <Droplets className="h-6 w-6" /> :
                              <Recycle className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-10">
                            <div>
                              <h3 className="text-xl font-black uppercase italic tracking-tighter">{entry.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="rounded-full px-3 py-0 text-[8px] font-black uppercase opacity-60 tracking-widest">{entry.category}</Badge>
                                <span className="text-[10px] font-black opacity-30 uppercase">{entry.date.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <ArrowUpRight className="h-6 w-6 opacity-0 group-hover:opacity-10 transition-opacity" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-8 pb-8 pt-0">
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed group-hover:text-foreground transition-colors">{entry.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
