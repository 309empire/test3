import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Zap, Globe, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tighter font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
            VOIDLINK
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white border-none shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                Claim your void
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono mb-8 text-primary/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            V2.0 IS LIVE
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter font-display mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30">
            ONE LINK <br />
            TO RULE THEM ALL
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate bio link for creators, cyberpunks, and digital nomads.
            Claim your unique identity in the void.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 rounded-full">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-black/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Lightning Fast"
              description="Optimized for speed. Your profile loads instantly, anywhere in the world."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-primary" />}
              title="Secure by Default"
              description="Enterprise-grade encryption keeps your data safe in the digital void."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-400" />}
              title="Custom Domain"
              description="Connect your own domain or use our premium short links."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-white/30 text-sm">
        <p>&copy; 2024 Voidlink. Crafted in the digital ether.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}
