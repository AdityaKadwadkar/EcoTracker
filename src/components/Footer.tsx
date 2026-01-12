import { Footer } from "./Footer"; // Assuming basic export from footer
// Wait, footer is typically default exported in this project.
// Re-writing Footer.tsx to be more premium as well.

import { Leaf, Twitter, Github, Linkedin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-32 border-t border-white/10 bg-background/20 backdrop-blur-md">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 font-bold text-3xl tracking-tighter uppercase italic">
              <Leaf className="h-8 w-8 text-primary" />
              EcoTrack
            </Link>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed font-medium">
              Industrial-grade sustainability telemetry for the modern world.
              Pioneering zero-waste methodologies through data.
            </p>
            <div className="flex items-center gap-6">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <button key={i} className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] opacity-40">System Vectors</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/energy" className="hover:text-primary transition-colors">Energy Grid</Link></li>
              <li><Link to="/water" className="hover:text-primary transition-colors">Hydration Logic</Link></li>
              <li><Link to="/waste" className="hover:text-primary transition-colors">Circular Economy</Link></li>
              <li><Link to="/analytics" className="hover:text-primary transition-colors">Telemetery Panel</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Protocol</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li className="flex items-center gap-2 opacity-50 cursor-not-allowed italic">Security <ExternalLink className="h-3 w-3" /></li>
              <li className="flex items-center gap-2 opacity-50 cursor-not-allowed italic">Vulnerability <ExternalLink className="h-3 w-3" /></li>
              <li className="flex items-center gap-2 opacity-50 cursor-not-allowed italic">API Cluster <ExternalLink className="h-3 w-3" /></li>
              <li className="flex items-center gap-2 opacity-50 cursor-not-allowed italic">Open Data <ExternalLink className="h-3 w-3" /></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            © {new Date().getFullYear()} EcoTrack Protocol. Engineered for Earth.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            <button className="hover:opacity-100 transition-opacity">Privacy Policy</button>
            <button className="hover:opacity-100 transition-opacity">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { Link } from "react-router-dom";
export default Footer;
