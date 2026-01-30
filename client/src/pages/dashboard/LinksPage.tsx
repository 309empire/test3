import { DashboardLayout } from "@/components/DashboardLayout";
import { useLinks, useCreateLink, useDeleteLink, useUpdateLink, useReorderLinks } from "@/hooks/use-links";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2, Edit2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLinkSchema, Link as LinkType } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { useMyProfile } from "@/hooks/use-profile";
import { PhonePreview } from "@/components/PhonePreview";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LinksPage() {
  const { data: links, isLoading } = useLinks();
  const { data: profile } = useMyProfile();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  // Combine profile and links for preview
  const previewProfile = profile && links ? { ...profile, links } : null;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Left Column: Link Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold font-display">Manage Links</h1>
             <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
               <Plus className="w-4 h-4 mr-2" /> Add Link
             </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Loading links...</p>
            ) : links?.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                <LinkIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No links yet</h3>
                <p className="text-muted-foreground text-sm mb-4">Start by adding your first link to the void.</p>
                <Button onClick={() => setIsCreateOpen(true)} variant="secondary">Add Link</Button>
              </div>
            ) : (
              links?.sort((a,b) => (a.order||0) - (b.order||0)).map((link) => (
                <LinkItem 
                  key={link.id} 
                  link={link} 
                  onEdit={() => setEditingLink(link)} 
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden lg:block lg:col-span-1">
           <div className="sticky top-24">
             <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">LIVE PREVIEW</h3>
             <PhonePreview profile={previewProfile} />
           </div>
        </div>
      </div>

      <CreateLinkDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {editingLink && (
        <EditLinkDialog 
          link={editingLink} 
          open={!!editingLink} 
          onOpenChange={(open) => !open && setEditingLink(null)} 
        />
      )}
    </DashboardLayout>
  );
}

function LinkItem({ link, onEdit }: { link: LinkType, onEdit: () => void }) {
  const { mutate: deleteLink } = useDeleteLink();
  const { mutate: updateLink } = useUpdateLink();

  return (
    <Card className="p-4 flex items-center gap-4 bg-card/40 hover:bg-card/60 transition-colors border-white/5">
      <div className="cursor-move text-muted-foreground hover:text-foreground">
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{link.title}</h4>
        <a href={link.url} target="_blank" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate">
          {link.url} <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex items-center gap-3">
        <Switch 
          checked={link.enabled || false}
          onCheckedChange={(checked) => updateLink({ id: link.id, enabled: checked })}
        />
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:text-destructive hover:bg-destructive/10" onClick={() => deleteLink(link.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function CreateLinkDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createLink } = useCreateLink();
  const form = useForm({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: { title: "", url: "", icon: "default", style: "default" }
  });

  const onSubmit = (data: any) => {
    createLink(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="My Portfolio" />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input {...form.register("url")} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
             <Select onValueChange={(val) => form.setValue("style", val)} defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <Button type="submit" className="w-full bg-primary text-white">Create Link</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditLinkDialog({ link, open, onOpenChange }: { link: LinkType, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: updateLink } = useUpdateLink();
  const form = useForm({
    resolver: zodResolver(insertLinkSchema.partial()),
    defaultValues: { title: link.title, url: link.url, style: link.style || "default", icon: link.icon || "default" }
  });

  const onSubmit = (data: any) => {
    updateLink({ id: link.id, ...data }, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input {...form.register("url")} />
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
             <Select onValueChange={(val) => form.setValue("style", val)} defaultValue={link.style || "default"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
