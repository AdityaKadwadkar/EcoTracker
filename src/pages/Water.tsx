import { useMemo, useState, useEffect } from "react";
import { Droplets, Plus, Sparkles, Waves, Bath, GlassWater, Activity, History, ArrowUpRight, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { usePersistentState } from "@/hooks/usePersistentState";
import { API } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface WaterEntry {
  id: string;
  created_at: string;
  category: "domestic" | "industrial" | "irrigation";
  entry_text: string;
  feedback?: string;
}

const categories = {
  domestic: { icon: Bath, label: "Domestic", placeholder: "Log household water usage (showering, laundry, cleaning)...", color: "text-sky-400" },
  industrial: { icon: Waves, label: "Industrial", placeholder: "Log process cooling, system flushing, large scale use...", color: "text-blue-500" },
  irrigation: { icon: GlassWater, label: "Irrigation", placeholder: "Log landscape, hydroponics, or farm water deployment...", color: "text-cyan-500" },
};

const Water = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"domestic" | "industrial" | "irrigation">("domestic");
  const [entryText, setEntryText] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [conservationGoal] = useState(500);
  const [waterSaved, setWaterSaved] = usePersistentState<number>("ecotrack:water-saved", 0);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .in('category', ['domestic', 'industrial', 'irrigation'])
        .order('created_at', { ascending: false });
      if (!error && data) setEntries(data as unknown as WaterEntry[]);
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

      if (text.includes("leak") || text.includes("drop")) {
        dummyFeedback = "AI Hydraulic Analysis: CRITICAL. Potential micro-leak detected in sector 4. Recommendation: Isolate valve block B immediately and inspect pressure sensors.";
      } else if (activeTab === "irrigation" || text.includes("garden")) {
        const soilMoisture = Math.floor(Math.random() * (60 - 30) + 30);
        dummyFeedback = `AI Hydraulic Analysis: Soil moisture content is ${soilMoisture}%. Irrigation scheduled is optimal. Suggestion: Reduce flow rate by 10% to prevent runoff based on local humidity forecast.`;
      } else if (activeTab === "industrial") {
        dummyFeedback = "AI Hydraulic Analysis: Industrial cooling loop efficiency is 96%. Water hardness levels are rising. Recommendation: Check softener salt levels and flushing cycle.";
      } else {
        const savings = Math.floor(Math.random() * (500 - 100) + 100);
        const variations = [
          `AI Hydraulic Analysis: Flow rate consistent. You have saved approx ${savings} liters this week compared to baseline.`,
          "AI Hydraulic Analysis: Water quality sensors indicate normal pH levels. No action required.",
          "AI Hydraulic Analysis: Usage spike detected at 08:00 AM. Investigating typical pattern correlation.",
          "AI Hydraulic Analysis: Conservation goal on track. Gray water system operating at peak capacity."
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
        .in('category', ['domestic', 'industrial', 'irrigation'])
        .order('created_at', { ascending: false });
      if (refreshed) setEntries(refreshed as unknown as WaterEntry[]);
      toast({ title: "Flow log captured" });
    } catch (err) {
      toast({ title: "System Offline", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = Math.min(100, (waterSaved / conservationGoal) * 100);

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <div className="lg:col-span-7 space-y-10">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Hydraulic Pressure
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Hydration Logic</h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
                  Intelligent telemetry for liquid resource monitoring and conservation audits.
                </p>
              </header>

              <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <div className="px-8 pt-8 bg-foreground/5 overflow-x-auto border-b border-white/10">
                      <TabsList className="bg-transparent h-12 gap-4 flex w-max">
                        {Object.entries(categories).map(([key, { icon: Icon, label, color }]) => (
                          <TabsTrigger
                            key={key}
                            value={key}
                            className="px-6 rounded-t-2xl border-b-2 border-transparent data-[state=active]:border-sky-500 data-[state=active]:bg-background/50 h-full flex gap-2 font-black uppercase tracking-wider text-[10px]"
                          >
                            <Icon className={cn("h-4 w-4", color)} />
                            {label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4 text-left">
                          <Label htmlFor="entry" className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 ml-1">Consumption Protocol</Label>
                          <Textarea
                            id="entry"
                            placeholder={categories[activeTab].placeholder}
                            value={entryText}
                            onChange={(e) => setEntryText(e.target.value)}
                            className="min-h-[160px] rounded-3xl border-none glass-card focus-visible:ring-sky-500 shadow-inner p-6 text-base"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isGenerating || !entryText.trim()}
                          className="w-full h-16 rounded-[1.5rem] bg-sky-500 hover:bg-sky-600 text-white font-black text-lg uppercase tracking-widest shadow-xl shadow-sky-500/20 transition-all hover:shadow-2xl hover:-translate-y-1"
                        >
                          {isGenerating ? "Analyzing Flow..." : "Save Protocol & Audit"}
                        </Button>
                      </form>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              {aiFeedback && (
                <Card className="glass-card bg-sky-500/10 border-sky-500/20 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-sky-500" /> Hydraulic Advisor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-lg leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap">{aiFeedback}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8">
              <Card className="glass-card rounded-[2.5rem] p-10 border-none bg-sky-500 text-white shadow-2xl shadow-sky-500/40">
                <div className="flex justify-between items-start mb-8">
                  <Target className="h-10 w-10 text-white/50" />
                  <div className="text-right">
                    <span className="block text-[10px] font-black uppercase opacity-60">Daily Conservation</span>
                    <span className="text-5xl font-black italic tracking-tighter">{progress.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span>{waterSaved}G Saved</span>
                    <span>{conservationGoal}G Goal</span>
                  </div>
                  <Button onClick={() => setWaterSaved(prev => prev + 10)} className="w-full h-12 rounded-2xl bg-white text-sky-500 hover:bg-white/90 font-black uppercase text-xs">
                    Increment Recovery +10G
                  </Button>
                </div>
              </Card>

              <div className="glass-card rounded-[2.5rem] p-8 border-none">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <History className="h-5 w-5 text-muted-foreground" /> Fluid Audit
                </h2>
                <div className="space-y-6">
                  {entries.length === 0 ? (
                    <div className="py-20 text-center opacity-40 italic">No fluid audits detected.</div>
                  ) : (
                    entries.slice(0, 5).map((e) => (
                      <div key={e.id} className="relative pl-8 border-l-2 border-white/10 group">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-sky-500" />
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase opacity-40">{new Date(e.created_at).toLocaleDateString()}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/10 text-sky-500">{e.category}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">{e.entry_text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-8 bg-zinc-900 border-none text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-sky-500/20 blur-[60px] group-hover:bg-sky-500/40 transition-all duration-700" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-sky-500 flex items-center justify-center">
                    <Info className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-xs tracking-widest mb-1">Leak Detection</h4>
                    <p className="text-sm text-zinc-400 font-bold leading-snug">System pressure stable. No anomalies detected in industrial cluster A.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Water;
