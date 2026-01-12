import { useState, useEffect } from "react";
import { Zap, Plus, Sun, Battery, Activity, Info, Sparkles, ArrowUpRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface EnergyEntry {
  id: string;
  created_at: string;
  category: "grid" | "solar" | "battery";
  entry_text: string;
  feedback?: string;
}

const energySources = [
  { value: "grid" as const, icon: Zap, label: "Grid", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { value: "solar" as const, icon: Sun, label: "Solar", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { value: "battery" as const, icon: Battery, label: "Battery", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const Energy = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [selectedSource, setSelectedSource] = useState<"grid" | "solar" | "battery" | null>(null);
  const [logDetails, setLogDetails] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solarEfficiency, setSolarEfficiency] = useState(94.2);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .in('category', ['grid', 'solar', 'battery'])
        .order('created_at', { ascending: false });
      if (!error && data) setEntries(data as unknown as EnergyEntry[]);
    };
    fetchEntries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSource || !logDetails.trim()) return;

    setIsAnalyzing(true);
    try {
      // DUMMY AI SIMULATION (Edge functions are currently disabled)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const keywords = logDetails.toLowerCase();
      let dummyFeedback = "AI Insight: Grid load distribution analyzed. Efficiency is within nominal parameters.";

      // Keyword based logic
      if (keywords.includes("hvac") || keywords.includes("temperature")) {
        dummyFeedback = "AI Insight: Thermal load detected. HVAC optimization opportunity identified. Recommendation: Pre-cool zones during off-peak hours to utilize thermal mass.";
      } else if (keywords.includes("solar") || selectedSource === "solar") {
        const efficiency = Math.floor(Math.random() * (98 - 85) + 85);
        dummyFeedback = `AI Insight: Solar array operating at ${efficiency}% efficiency. Irradiance levels are optimal. Suggestion: Schedule battery charging cycle now to capture excess generation.`;
      } else if (keywords.includes("peak")) {
        dummyFeedback = "AI Insight: Peak load event predicted. Recommendation: Shed non-critical loads immediately to avoid demand charges. Battery discharge recommended.";
      } else if (selectedSource === "battery") {
        const soc = Math.floor(Math.random() * (100 - 40) + 40);
        dummyFeedback = `AI Insight: Battery State of Charge (SoC) is ${soc}%. Cell balancing required soon. optimize discharge rate to extend cycle life.`;
      } else {
        // Random generic variations
        const variations = [
          "AI Insight: Grid stability is nominal. No significant anomalies detected in recent telemetry.",
          "AI Insight: Consumption pattern matches historical baseline. Efficiency score: 92/100. Keep maintaining current setpoints.",
          "AI Insight: Minor harmonic distortion detected. Monitor power factor correction units.",
          "AI Insight: Load profile is flat. Excellent demand management. Consider lowering peak threshold alerts."
        ];
        dummyFeedback = variations[Math.floor(Math.random() * variations.length)];
      }

      // Direct Client-Side Insert
      const { error } = await supabase
        .from('entries')
        .insert({
          user_id: user.id,
          category: selectedSource,
          entry_text: logDetails,
          feedback: dummyFeedback
        });

      if (error) throw error;

      setAiAnalysis(dummyFeedback);
      setLogDetails("");
      setSelectedSource(null);

      // Dynamic Efficiency Update
      const fluctuation = (Math.random() * 5) - 2.5; // Random fluctuation between -2.5% and +2.5%
      setSolarEfficiency(prev => Math.min(100, Math.max(0, prev + fluctuation)));

      const { data: refreshed } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .in('category', ['grid', 'solar', 'battery'])
        .order('created_at', { ascending: false });
      if (refreshed) setEntries(refreshed as unknown as EnergyEntry[]);

      toast({ title: "Energy telemtry recorded", description: "AI efficiency insights available." });
    } catch (err) {
      toast({ title: "Communication Error", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Stats & Log Form */}
            <div className="lg:col-span-7 space-y-10">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Live Control
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Energy Grid</h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
                  Manage your power consumption profiles and optimize for renewable penetration.
                </p>
              </header>

              <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-foreground/5 p-8 border-b border-white/10 font-bold text-lg uppercase tracking-tight flex-row items-center gap-4">
                  <Plus className="h-5 w-5 text-primary" /> Record Telemetry
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <Label className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 ml-1">Select Source Vector</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {energySources.map(({ value, icon: Icon, label, color, bg, border }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedSource(value)}
                            className={cn(
                              "flex flex-col items-center gap-4 rounded-3xl p-6 transition-all duration-300 border-2",
                              selectedSource === value
                                ? "bg-foreground text-background border-foreground shadow-2xl shadow-foreground/20 scale-[1.02]"
                                : cn("bg-background/20 hover:bg-background/50 border-white/10", color)
                            )}
                          >
                            <Icon className={cn("h-8 w-8", selectedSource === value ? "text-background" : color)} />
                            <span className="text-xs font-black uppercase tracking-tighter">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      <Label htmlFor="details" className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 ml-1">Consumption Details</Label>
                      <Textarea
                        id="details"
                        placeholder="e.g., HVAC Load optimization, HVAC at 72F, Peak hours monitoring..."
                        value={logDetails}
                        onChange={(e) => setLogDetails(e.target.value)}
                        className="min-h-[160px] rounded-3xl border-none glass-card focus-visible:ring-primary shadow-inner p-6 text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isAnalyzing || !selectedSource || !logDetails.trim()}
                      className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:-translate-y-1"
                    >
                      {isAnalyzing ? "Processing Telemetry..." : "Process Log & Advise"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {aiAnalysis && (
                <Card className="glass-card bg-primary/10 border-primary/20 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-black uppercase flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-primary" /> AI Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-lg leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap">{aiAnalysis}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: History & Stats */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card rounded-[2.5rem] p-8 border-none">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <History className="h-5 w-5 text-muted-foreground" /> Analytics Stream
                </h2>

                <div className="space-y-6">
                  {entries.length === 0 ? (
                    <div className="py-20 text-center opacity-40 italic">No telemetry streams found.</div>
                  ) : (
                    entries.slice(0, 5).map((entry) => {
                      const source = energySources.find(s => s.value === entry.category);
                      return (
                        <div key={entry.id} className="relative pl-8 border-l-2 border-white/10 group">
                          <div className={cn("absolute -left-[5px] top-0 w-2 h-2 rounded-full", source?.color.replace('text', 'bg'))} />
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase opacity-40">{new Date(entry.created_at).toLocaleString()}</span>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded", source?.bg, source?.color)}>{source?.label}</span>
                          </div>
                          <p className="text-sm font-medium line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">{entry.entry_text}</p>
                        </div>
                      )
                    })
                  )}
                </div>

                {entries.length > 5 && (
                  <Button variant="link" className="w-full mt-8 font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100">
                    View Full Audit Trail <ArrowUpRight className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>

              <Card className="glass-card rounded-[2.5rem] overflow-hidden border-none text-background bg-foreground">
                <CardContent className="p-10">
                  <div className="flex justify-between items-start mb-10">
                    <Sun className="h-10 w-10 text-orange-400" />
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase opacity-60">Solar Efficiency</span>
                      <span className="text-4xl font-black italic tracking-tighter">{solarEfficiency.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold opacity-80 leading-snug">Grid utilization at historical lows. Battery array at 88% SOC.</p>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-4/5 shadow-[0_0_10px_white]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Energy;
