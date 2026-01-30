import { usePublicProfile } from "@/hooks/use-profile";
import { LinkCard } from "@/components/LinkCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";

export default function PublicProfile({ params }: { params: { username: string } }) {
  const { data: profile, isLoading, error } = usePublicProfile(params.username);

  // Dynamic document title
  useEffect(() => {
    if (profile?.displayName) {
      document.title = `${profile.displayName} | Voidlink`;
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!profile || error) {
    return <NotFound />;
  }

  const bgStyle = profile.backgroundType === "image" 
    ? { backgroundImage: `url(${profile.backgroundValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : profile.backgroundType === "gradient"
    ? { background: profile.backgroundValue || "linear-gradient(to bottom, #000000, #434343)" }
    : { backgroundColor: profile.backgroundValue || "#000000" };

  const theme = profile.themeSettings as any || {};
  const fontFamily = theme.fontFamily || "var(--font-body)";
  const textColor = theme.textColor || "#ffffff";

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{ ...bgStyle, fontFamily, color: textColor }}>
      
      {/* Background Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      {/* Scanline Effect if enabled - hardcoded enabled for aesthetic for now */}
      <div className="scanline" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center"
      >
        {/* Avatar */}
        {profile.avatarUrl && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-6 shadow-2xl backdrop-blur-sm"
          >
            <img src={profile.avatarUrl} alt={profile.displayName || "Avatar"} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Name & Bio */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight drop-shadow-lg"
        >
          {profile.displayName || `@${params.username}`}
        </motion.h1>
        
        {profile.bio && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center opacity-80 mb-10 max-w-md text-lg drop-shadow-md"
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Links List */}
        <div className="w-full space-y-4">
          <AnimatePresence>
            {profile.links?.filter(l => l.enabled).sort((a,b) => (a.order||0) - (b.order||0)).map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <LinkCard link={link} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Branding Footer */}
        <footer className="mt-auto pt-16 pb-6 text-sm opacity-50 hover:opacity-100 transition-opacity">
          <a href="/" className="font-display font-bold tracking-widest uppercase">Voidlink</a>
        </footer>
      </motion.div>
    </div>
  );
}
