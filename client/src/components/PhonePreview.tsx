import { ProfileWithLinks } from "@shared/schema";
import { LinkCard } from "./LinkCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PhonePreview({ profile }: { profile: ProfileWithLinks | null }) {
  if (!profile) return null;

  const bgStyle = profile.backgroundType === "image" 
    ? { backgroundImage: `url(${profile.backgroundValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : profile.backgroundType === "gradient"
    ? { background: profile.backgroundValue || "linear-gradient(to bottom, #000000, #434343)" }
    : { backgroundColor: profile.backgroundValue || "#000000" };

  // Apply JSON settings
  const theme = profile.themeSettings as any || {};
  const fontFamily = theme.fontFamily || "var(--font-body)";
  const textColor = theme.textColor || "#ffffff";
  
  return (
    <div className="relative w-[320px] h-[640px] border-[12px] border-black rounded-[3rem] shadow-2xl overflow-hidden bg-background mx-auto">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
      
      {/* Screen Content */}
      <div 
        className="w-full h-full relative overflow-hidden"
        style={{ ...bgStyle }}
      >
        {/* Overlay if needed for legibility */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        <ScrollArea className="h-full w-full relative z-10">
          <div className="flex flex-col items-center p-6 pt-16 min-h-full">
            {profile.avatarUrl && (
              <div className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden mb-4 shadow-xl">
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
            
            <h1 
              className="text-xl font-bold mb-1 text-center"
              style={{ fontFamily: theme.fontFamily || "inherit", color: textColor }}
            >
              @{profile.displayName || "Username"}
            </h1>
            
            {profile.bio && (
              <p 
                className="text-sm opacity-80 mb-8 text-center max-w-[240px]"
                style={{ fontFamily: theme.fontFamily || "inherit", color: textColor }}
              >
                {profile.bio}
              </p>
            )}

            <div className="w-full space-y-4">
              {profile.links?.filter(l => l.enabled).sort((a,b) => (a.order||0) - (b.order||0)).map(link => (
                <LinkCard key={link.id} link={link} preview />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
