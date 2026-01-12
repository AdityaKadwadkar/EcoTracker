import { Link } from "react-router-dom";
import { Zap, Droplets, Recycle, ArrowRight, BarChart3, Shield, Globe, Award, Sparkles, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const Index = () => {
  const pillars = [
    {
      title: "Energy Grid",
      description: "Smart monitoring of your power lifecycle and efficiency.",
      icon: Zap,
      color: "amber",
      link: "/energy",
      stats: "12% reduction",
    },
    {
      title: "Hydration Logic",
      description: "Intelligent water tracking and leak detection systems.",
      icon: Droplets,
      color: "sky",
      link: "/water",
      stats: "Ready to log",
    },
    {
      title: "Circular Economy",
      description: "Advanced waste diversion and recycling analytics.",
      icon: Recycle,
      color: "emerald",
      link: "/waste",
      stats: "75% Diversion",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />

      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="h-3 w-3" />
                Next-Gen Sustainability
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-glow">
                Future-Proof Your <br />
                <span className="text-primary italic">Environmental</span> Footprint
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                EcoTrack delivers industrial-grade analytics for your personal or enterprise sustainability journey.
                Smarter data. Zero waste.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/40 text-lg font-bold group">
                  <Link to="/analytics" className="flex items-center gap-3">
                    Launch Control Center <MoveRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/20 glass-card text-lg font-bold hover:bg-white/10">
                  <Link to="/energy">Monitor Consumption</Link>
                </Button>
              </div>
            </div>

            {/* Visual elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          </div>
        </section>

        {/* Bento Grid Feature Showcase */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {/* Large Feature */}
              <Card className="md:col-span-2 md:row-span-2 overflow-hidden glass-card group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardHeader className="p-10 relative z-10">
                  <BarChart3 className="h-12 w-12 text-primary mb-6" />
                  <CardTitle className="text-4xl font-black mb-4">Precision Analytics</CardTitle>
                  <CardDescription className="text-lg leading-relaxed max-w-md">
                    Visualize every joule and drops with our interactive telemetry dashboard.
                    Identify patterns, detect anomalies, and optimize your resource allocation with AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 relative z-10 flex justify-end">
                  <Button variant="link" className="text-primary font-bold gap-2 text-lg">
                    Explore Dashboard <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>

              {/* Support Cards */}
              <Card className="glass-card hover:translate-y-[-8px] transition-all duration-300">
                <CardHeader className="p-8">
                  <Shield className="h-8 w-8 text-sky-500 mb-4" />
                  <CardTitle className="text-xl font-bold">Encrypted Logs</CardTitle>
                  <CardDescription>Your environmental data is kept secure and private.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card hover:translate-y-[-8px] transition-all duration-300">
                <CardHeader className="p-8">
                  <Globe className="h-8 w-8 text-emerald-500 mb-4" />
                  <CardTitle className="text-xl font-bold">Global Benchmarking</CardTitle>
                  <CardDescription>Compare your performance with industry standards.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="md:col-span-3 glass-card overflow-hidden">
                <div className="flex flex-col md:flex-row items-center p-10 gap-10">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Circular Economy Ready</h3>
                    <p className="text-muted-foreground text-lg">
                      EcoTrack is built for the modular future. Track your transition to 100% renewable energy
                      and zero-waste manufacturing models seamlessly.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {['Renewables', 'Recycling', 'Zero Leakage', 'AI Optimized'].map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-sm font-bold opacity-60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pillars / Navigation */}
        <section className="py-24 bg-foreground/[0.02]">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Direct Access</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Deep-dive into the core vectors of impact. Select a pillar to begin management.
                </p>
              </div>
              <Button asChild variant="outline" className="hidden lg:flex rounded-xl gap-2 h-12 border-white/20 glass-card">
                <Link to="/analytics">View All <BarChart3 className="h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {pillars.map(({ title, description, icon: Icon, color, link, stats }) => (
                <Link key={title} to={link} className="block group">
                  <div className="h-full p-8 rounded-[2rem] glass-card group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 border border-white/20 shadow-2xl shadow-transparent hover:shadow-primary/20">
                    <div className={cn(
                      "mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/20 bg-background/50",
                      color === 'amber' ? 'text-amber-500' : color === 'sky' ? 'text-sky-500' : 'text-emerald-500'
                    )}>
                      <Icon className="h-7 w-7 transition-colors duration-500 group-hover:text-white" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black tracking-tight uppercase">{title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2 py-1 rounded bg-black/5 dark:bg-white/10">
                        {stats}
                      </span>
                    </div>
                    <p className="text-muted-foreground group-hover:text-primary-foreground/80 leading-relaxed font-medium">
                      {description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-32 overflow-hidden relative">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto glass-card p-16 rounded-[3rem] border border-white/30 dark:border-white/10 shadow-2xl shadow-primary/10 relative z-10">
              <Award className="mx-auto mb-8 h-20 w-20 text-primary" />
              <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase">Ready for optimization?</h2>
              <p className="text-xl text-muted-foreground mb-12 font-medium">
                Join thousands of users defining the future of resource management.
              </p>
              <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-foreground text-background hover:scale-105 transition-transform text-lg font-black group">
                <Link to="/analytics" className="flex items-center gap-3">
                  Get Started Free <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
