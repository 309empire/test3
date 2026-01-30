import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, ExternalLink, MapPin, Calendar, Eye, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';

export default function PublicProfile() {
  const [, params] = useRoute("/:username");
  const [revealed, setRevealed] = useState(false);
  const username = params?.username;

  const { data, isLoading, error } = useQuery<any>({
    queryKey: [`/api/public/profile/${username}`],
    enabled: !!username,
    retry: false
  });

  const { data: badgeData } = useQuery<any>({
    queryKey: ["/api/badges"],
  });

  useEffect(() => {
    if (data?.profile && !data.profile.revealEnabled) {
      setRevealed(true);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black mb-2 uppercase tracking-widest text-orange-500">404</h1>
        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">User not found</p>
        <Button asChild variant="link" className="mt-8 text-orange-500 uppercase text-xs font-black tracking-widest">
          <a href="/">Go Home</a>
        </Button>
      </div>
    );
  }

  const { user, profile } = data;
  const showReveal = profile?.revealEnabled && !revealed;

  const getBadgeIcon = (badgeName: string) => {
    const badge = badgeData?.find((b: any) => b.name === badgeName);
    if (badge) return badge.icon;
    return '';
  };

  const renderImage = (url: string | null, alt: string, className: string) => {
    if (!url) return null;
    const finalUrl = url.startsWith('/objects/') ? `${window.location.origin}${url}` : url;
    return (
      <img 
        src={finalUrl} 
        alt={alt} 
        className={className}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes(window.location.origin) && url.startsWith('/objects/')) {
            target.src = `${window.location.origin}${url}`;
          }
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      {/* Background Media */}
      {profile?.backgroundVideoUrl ? (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video src={profile.backgroundVideoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-40 blur-[2px]" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      ) : profile?.backgroundUrl ? (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {renderImage(profile.backgroundUrl, "background", "w-full h-full object-cover opacity-40 blur-[2px]")}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      ) : null}

              {profile?.musicUrl && (
                <audio 
                  src={profile.musicUrl.startsWith('/objects/') ? `${window.location.origin}${profile.musicUrl}` : profile.musicUrl} 
                  autoPlay 
                  loop 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes(window.location.origin) && profile.musicUrl.startsWith('/objects/')) {
                      target.src = `${window.location.origin}${profile.musicUrl}`;
                    }
                  }}
                />
              )}

      <AnimatePresence>
        {showReveal ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => setRevealed(true)}
          >
            {/* Background on Reveal Screen */}
            {profile?.backgroundVideoUrl ? (
              <div className="absolute inset-0 z-0 pointer-events-none">
                <video src={profile.backgroundVideoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-20 blur-[4px]" />
                <div className="absolute inset-0 bg-black/80"></div>
              </div>
            ) : profile?.backgroundUrl && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                {renderImage(profile.backgroundUrl, "background", "w-full h-full object-cover opacity-20 blur-[4px]")}
                <div className="absolute inset-0 bg-black/80"></div>
              </div>
            )}

            <motion.div 
              animate={{ scale: [1, 1.05, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center space-y-4 relative z-10"
            >
              {profile?.bannerUrl && (
                <div className="w-64 h-24 rounded-2xl overflow-hidden border border-white/5 mb-8 mx-auto">
                  {renderImage(profile.bannerUrl, "banner", "w-full h-full object-cover opacity-50")}
                </div>
              )}
              <span className="text-6xl group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all">⚡</span>
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-orange-500 group-hover:text-white transition-colors">
                {profile.revealText || "Click to reveal"}
              </h2>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full space-y-8 relative z-10"
          >
            {/* Banner Section */}
            {profile?.bannerUrl && (
              <div className="w-full h-48 rounded-3xl overflow-hidden border border-white/5 relative mb-[-4rem]">
                {renderImage(profile.bannerUrl, "banner", "w-full h-full object-cover")}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60"></div>
              </div>
            )}

            {/* Header / Avatar Section */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="w-32 h-32 rounded-full border-2 border-white/5 overflow-hidden relative z-10 bg-[#111]">
                  {profile?.avatarUrl ? (
                    renderImage(profile.avatarUrl, user.username, "w-full h-full object-cover")
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10 select-none">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-4xl font-black uppercase tracking-wider">{profile.displayName || user.username}</h1>
                </div>
                
                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    <TooltipProvider>
                      {user.badges.map((badgeName: string) => {
                        const icon = getBadgeIcon(badgeName);
                        return (
                          <Tooltip key={badgeName}>
                            <TooltipTrigger>
                              <div className="w-6 h-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help">
                                {icon?.startsWith('http') || icon?.startsWith('/objects/') ? (
                                  renderImage(icon, badgeName, "w-full h-full object-contain")
                                ) : (
                                  <span className="text-lg">{icon}</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border-white/10 text-orange-500 font-bold uppercase text-[10px] tracking-widest">
                              {badgeName}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                )}
              </div>

              {profile.bio && (
                <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-medium">
                  <ReactMarkdown>{profile.bio}</ReactMarkdown>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                {profile.location && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    {profile.location}
                  </div>
                )}
                {profile.showJoinDate && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                    <Calendar className="w-3 h-3 text-orange-500" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                )}
                {profile.showUid && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                    <Hash className="w-3 h-3 text-orange-500" />
                    UID: {user.id}
                  </div>
                )}
                {profile.showViews && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                    <Eye className="w-3 h-3 text-orange-500" />
                    {user.views} Views
                  </div>
                )}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid gap-3">
              {(data.links || []).sort((a: any, b: any) => a.position - b.position).map((link: any) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl transition-all hover:border-orange-500/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/5 group-hover:border-orange-500/50 transition-colors shrink-0">
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-black uppercase tracking-widest text-sm group-hover:text-orange-500 transition-colors">{link.title}</h3>
                    {link.description && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{link.description}</p>}
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Footer */}
            {profile.showWatermark && (
              <div className="pt-12 pb-8 text-center">
                <a href="/" className="inline-flex items-center gap-2 group">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-orange-500 transition-colors">Powered by Voidlink</span>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
