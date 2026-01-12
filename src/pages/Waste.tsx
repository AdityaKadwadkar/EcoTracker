import { useEffect, useMemo, useState } from "react";
import { Recycle, Plus, Sparkles, Leaf, Trash2, Activity, History, ArrowUpRight, BarChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistentState } from "@/hooks/usePersistentState";
import { API } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface WasteEntry {
  id: string;
  created_at: string;
  category: "recycling" | "composting" | "landfill";
  entry_text: string;
  feedback?: string;
}

const categories = {
  recycling: { icon: Recycle, label: "Recycling", placeholder: "Log reclamation logs (polymers, metals, glass)...", color: "text-blue-500" },
  composting: { icon: Leaf, label: "Composting", placeholder: "Log biodegradable diversion and soil health input...", color: "text-emerald-500" },
  landfill: { icon: Trash2, label: "Landfill", placeholder: "Log non-divertible waste streams... minimize this.", color: "text-slate-500" },
};

const Waste = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"recycling" | "composting" | "landfill">("recycling");
  const [entryText, setEntryText] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .in('category', ['recycling', 'composting', 'landfill'])
        .order('created_at', { ascending: false });
      if (!error && data) setEntries(data as unknown as WasteEntry[]);
    };
    fetchEntries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !entryText.trim()) return;

    setIsGenerating(true);
    try {
      // DUMMY AI SIMULATION
      await new Promise(resolve => setTimeout(resolve, 2000));

      const text = entryText.toLowerCase();
      let dummyFeedback = "";

      if (text.includes("plastic") || text.includes("polymer")) {
        dummyFeedback = "AI Stream Audit: Polymer detected. Ensure separation of PET vs HDPE to maximize recycling revenue. Contamination risk: Low.";
      } else if (activeTab === "composting" || text.includes("food") || text.includes("organic")) {
        const carbonRatio = Math.floor(Math.random() * (30 - 20) + 20);
        dummyFeedback = `AI Stream Audit: Organic load analyzed. C:N ratio is estimated at ${carbonRatio}:1. perfect for rapid decomposition. Recommendation: Aerate pile in 2 days.`;
      } else if (activeTab === "landfill") {
        dummyFeedback = "AI Stream Audit: Landfill diversion alert. 30% of this stream could potentially be recovered via thermal waste-to-energy processes. Please review sort protocols.";
      } else {
        const variations = [
          "AI Stream Audit: Material composition identified. Diversion potential is high (85%). excellent sorting compliance.",
          "AI Stream Audit: Hazardous material scan negative. Safe for standard processing.",
          "AI Stream Audit: Batch weight recorded. You are 12% below your waste generation cap for this month.",
          "AI Stream Audit: Recycling metrics updating. Metal recovery rate is currently exceeding targets."
        ];
        dummyFeedback = variations[Math.floor(Math.random() * variations.length)];
      }

      const { error } = await supabase
        .from('entries')
        .insert({
          user_id: user.id,
          category: activeTab,
          entry_text: entryText,
          feedback: dummyFeedback
        });

      if (error) throw error;

      setAiFeedback(dummyFeedback);
      setEntryText("");

      const { data: refreshed } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .in('category', ['recycling', 'composting', 'landfill'])
        .order('created_at', { ascending: false });
      if (refreshed) setEntries(refreshed as unknown as WasteEntry[]);
      toast({ title: "Circular log added" });
    } catch (err) {
      toast({ title: "System Error", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const diversionRate = useMemo(() => {
    if (entries.length === 0) return 0;
    const diverted = entries.filter(e => e.category !== 'landfill').length;
    return Math.round((diverted / entries.length) * 100);
  }, [entries]);

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <div className="lg:col-span-7 space-y-10">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Mass Balance
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Circular Economy</h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
                  Optimize your diversion vectors and eliminate landfill legacy.
                </p>
              </header>

              <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <Label className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 ml-1">Diversion Vector</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(categories).map(([key, { icon: Icon, label, color }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key as any)}
                            className={cn(
                              "flex flex-col items-center gap-4 rounded-3xl p-6 transition-all duration-300 border-2",
                              activeTab === key
                                ? "bg-foreground text-background border-foreground shadow-2xl shadow-foreground/20 scale-[1.02]"
                                : cn("bg-background/20 hover:bg-background/50 border-white/10", color)
                            )}
                          >
                            <Icon className={cn("h-8 w-8", activeTab === key ? "text-background" : color)} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      <Label htmlFor="entry" className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 ml-1">Stream Analysis</Label>
                      <Textarea
                        id="entry"
                        placeholder={categories[activeTab].placeholder}
                        value={entryText}
                        onChange={(e) => setEntryText(e.target.value)}
                        className="min-h-[160px] rounded-3xl border-none glass-card focus-visible:ring-emerald-500 shadow-inner p-6 text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isGenerating || !entryText.trim()}
                      className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      {isGenerating ? "Analyzing stream..." : "Commit Stream Log"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {aiFeedback && (
                <Card className="glass-card bg-emerald-500/10 border-emerald-500/20 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                      <PieChart className="h-6 w-6 text-emerald-500" /> Equilibrium Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-lg leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap">{aiFeedback}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8">
              <Card className="glass-card rounded-[2.5rem] p-10 border-none bg-zinc-900 shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Recycle className="h-32 w-32 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded bg-emerald-500 text-background text-[10px] font-black uppercase tracking-widest mb-6">Efficiency Metric</span>
                  <h3 className="text-muted-foreground font-bold mb-2">Current Diversion Rate</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-7xl font-black text-white italic tracking-tighter">{diversionRate}%</span>
                    <span className="text-emerald-500 font-bold uppercase text-xs">Diverted</span>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Excellent performance in biodegradable sectors. Focus on plastic polymer reclamation next.
                  </p>
                </div>
              </Card>

              <div className="glass-card rounded-[2.5rem] p-8 border-none">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 font-outfit">
                  <History className="h-5 w-5 text-muted-foreground" /> Log Integrity
                </h2>
                <div className="space-y-6">
                  {entries.length === 0 ? (
                    <div className="py-20 text-center opacity-40 italic">No stream audits recorded.</div>
                  ) : (
                    entries.slice(0, 5).map((e) => (
                      <div key={e.id} className="relative pl-8 border-l-2 border-white/10 group">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500" />
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase opacity-40">{new Date(e.created_at).toLocaleDateString()}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{e.category}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">{e.entry_text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] glass-card border-none bg-emerald-500/5 relative">
                <h4 className="font-bold text-emerald-600 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Weekly Sustainability Tip
                </h4>
                <p className="text-foreground/70 font-medium italic text-sm">
                  "Reducing at the source is 5x more effective than downcycling polymers.
                  Audit your supplier packaging profiles this month."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Waste;
