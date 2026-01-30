import { Link as LinkType } from "@shared/schema";
import { ExternalLink, Github, Instagram, Linkedin, Mail, Twitter, Youtube, Globe, Music, Twitch } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LinkCardProps {
  link: LinkType;
  className?: string;
  preview?: boolean;
}

const ICONS: Record<string, any> = {
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  music: Music,
  mail: Mail,
  website: Globe,
  default: ExternalLink,
};

export function LinkCard({ link, className, preview = false }: LinkCardProps) {
  const Icon = ICONS[link.icon?.toLowerCase() || "default"] || ICONS.default;

  const styleClasses = {
    default: "bg-secondary/80 hover:bg-secondary border border-white/10 text-white",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white",
    neon: "bg-black/80 border border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]",
    minimal: "bg-transparent border-b border-white/20 hover:border-white text-white rounded-none px-0",
    rounded: "rounded-full bg-white text-black hover:bg-white/90 font-bold",
  };

  const selectedStyle = styleClasses[link.style as keyof typeof styleClasses] || styleClasses.default;

  const content = (
    <>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5">
        <Icon className="w-5 h-5" />
      </div>
      <span className="flex-1 text-center font-medium truncate px-4">{link.title}</span>
      {/* Spacer for centering */}
      <div className="w-10" /> 
    </>
  );

  const Component = preview ? "div" : motion.a;
  
  const motionProps = preview ? {} : {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
  };

  return (
    // @ts-ignore - motion.a vs div typing
    <Component
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center w-full p-2 mb-4 rounded-xl transition-all duration-200 cursor-pointer",
        selectedStyle,
        className
      )}
      {...motionProps}
    >
      {content}
    </Component>
  );
}
