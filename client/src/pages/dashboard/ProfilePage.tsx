import { DashboardLayout } from "@/components/DashboardLayout";
import { useMyProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useLinks } from "@/hooks/use-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { PhonePreview } from "@/components/PhonePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  const { data: links } = useLinks();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      displayName: "",
      bio: "",
      avatarUrl: "",
      backgroundType: "color",
      backgroundValue: "#000000",
      themeSettings: { fontFamily: "var(--font-body)", textColor: "#ffffff" }
    }
  });

  // Load initial data
  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
        backgroundType: profile.backgroundType || "color",
        backgroundValue: profile.backgroundValue || "#000000",
        themeSettings: profile.themeSettings as any || { fontFamily: "var(--font-body)", textColor: "#ffffff" }
      });
    }
  }, [profile, form]);

  const onSubmit = (data: any) => {
    updateProfile(data);
  };

  // Live preview data merging form state with real data
  const formValues = form.watch();
  const previewProfile = profile ? { ...profile, ...formValues, links: links || [] } : null;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold font-display">Appearance</h1>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <TabsContent value="general">
                <Card className="bg-card/40 border-white/5">
                  <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input {...form.register("displayName")} placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea {...form.register("bio")} placeholder="Tell the world who you are..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Avatar URL</Label>
                      <Input {...form.register("avatarUrl")} placeholder="https://..." />
                      <p className="text-xs text-muted-foreground">Paste a URL for your profile picture.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="background">
                 <Card className="bg-card/40 border-white/5">
                  <CardHeader><CardTitle>Background Style</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        onValueChange={(val) => form.setValue("backgroundType", val)} 
                        defaultValue={profile?.backgroundType || "color"}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="color">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="image">Image URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input {...form.register("backgroundValue")} placeholder="#000000 or URL" />
                      <p className="text-xs text-muted-foreground">Enter hex code, gradient CSS, or Image URL.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="theme">
                 <Card className="bg-card/40 border-white/5">
                  <CardHeader><CardTitle>Theme Settings</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                       <Select 
                        onValueChange={(val) => form.setValue("themeSettings.fontFamily", val)} 
                        defaultValue={(profile?.themeSettings as any)?.fontFamily || "var(--font-body)"}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="var(--font-body)">Inter (Clean)</SelectItem>
                          <SelectItem value="var(--font-display)">Space Grotesk (Tech)</SelectItem>
                          <SelectItem value="var(--font-mono)">JetBrains Mono (Code)</SelectItem>
                          <SelectItem value="'Courier New', monospace">Retro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label>Text Color</Label>
                      <Input type="color" {...form.register("themeSettings.textColor")} className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 min-w-[150px]">
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden lg:block lg:col-span-1">
           <div className="sticky top-24">
             <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">LIVE PREVIEW</h3>
             <PhonePreview profile={previewProfile} />
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
