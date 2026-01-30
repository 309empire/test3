        import { useAuth } from "@/hooks/use-auth";
        import { Loader2, User as UserIcon, Shield, Settings, Grid, Database, Award, Ban, UserCog, Upload } from "lucide-react";
        import { Button } from "@/components/ui/button";
        import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
        import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
        import { Input } from "@/components/ui/input";
        import { Textarea } from "@/components/ui/textarea";
        import { Switch } from "@/components/ui/switch";
        import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
        import { Checkbox } from "@/components/ui/checkbox";
        import { useQuery, useMutation } from "@tanstack/react-query";
        import { apiRequest, queryClient } from "@/lib/queryClient";
        import { useToast } from "@/hooks/use-toast";
        import { useState, useEffect } from "react";
        import { useUpload } from "@/hooks/use-upload";

        function BadgeEditor({ badge }: { badge?: any }) {
          const { toast } = useToast();
          const [name, setName] = useState(badge?.name || "");
          const [icon, setIcon] = useState(badge?.icon || "");
          const [loading, setLoading] = useState(false);
          const { uploadFile, isUploading } = useUpload();

          const handleSave = async () => {
            setLoading(true);
            try {
              if (badge) {
                await apiRequest("PATCH", `/api/admin/badges/${badge.id}`, { name, icon });
              } else {
                await apiRequest("POST", "/api/admin/badges", { name, icon });
              }
              queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
              toast({ title: badge ? "Badge updated" : "Badge created" });
            } catch (err) {
              toast({ title: "Error saving badge", variant: "destructive" });
            } finally {
              setLoading(false);
            }
          };

          return (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Badge Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Verified" className="bg-black border-white/5" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Badge Icon (Emoji or URL)</label>
                <div className="flex gap-2">
                  <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. ✔️ or https://..." className="bg-black border-white/5" />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 hover:bg-white/5 shrink-0"
                    onClick={() => document.getElementById('badge-icon-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                  <input 
                    id="badge-icon-upload"
                    type="file" 
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const result = await uploadFile(file);
                          if (result) {
                            setIcon(result.objectPath);
                            toast({ title: "Icon uploaded" });
                          }
                        } catch (err) {
                          toast({ title: "Upload failed", variant: "destructive" });
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full bg-orange-500 text-black font-black">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Badge"}
              </Button>
            </div>
          );
        }

        export default function Dashboard({ activeTab: initialTab = "home" }: { activeTab?: string }) {
          const { user, logout } = useAuth();
          const { toast } = useToast();
          const { uploadFile, isUploading: isBannerUploading } = useUpload();
          const [activeTab, setActiveTab] = useState(initialTab);
          const [localProfile, setLocalProfile] = useState<any>(null);

          const { data: adminUsers } = useQuery<any>({
            queryKey: ["/api/admin/users"],
            enabled: user?.role !== "user",
          });

          const { data: profile, isLoading: profileLoading } = useQuery<any>({
            queryKey: ["/api/profile"],
          });

          const { data: badges } = useQuery<any>({
            queryKey: ["/api/badges"],
          });

          useEffect(() => {
            if (profile && !localProfile) {
              setLocalProfile(profile);
            }
          }, [profile, localProfile]);

          const profileMutation = useMutation({
            mutationFn: async (updates: any) => {
              await apiRequest("PATCH", "/api/profile", updates);
            },
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
              toast({ title: "Profile updated successfully" });
            },
          });

          const handleSave = () => {
            if (localProfile) {
              profileMutation.mutate(localProfile);
            }
          };

          const updateLocal = (field: string, value: any) => {
            setLocalProfile((prev: any) => ({ ...prev, [field]: value }));
          };

          if (!user || profileLoading) {
            return (
              <div className="h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-orange-500" />
              </div>
            );
          }

          const isAdmin = user.role !== "user";

          return (
            <div className="min-h-screen bg-[#090909] text-white font-sans">
              <header className="border-b border-white/5 bg-[#090909]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-12">
                    <span className="text-2xl font-black text-orange-500 tracking-tighter">⚡</span>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
                      <TabsList className="bg-transparent gap-1">
                        <TabsTrigger value="home" className="data-[state=active]:text-orange-500 data-[state=active]:bg-white/5 px-4 h-9 rounded-full transition-all">Home</TabsTrigger>
                        <TabsTrigger value="profile" className="data-[state=active]:text-orange-500 data-[state=active]:bg-white/5 px-4 h-9 rounded-full transition-all">Profile</TabsTrigger>
                        <TabsTrigger value="options" className="data-[state=active]:text-orange-500 data-[state=active]:bg-white/5 px-4 h-9 rounded-full transition-all">Options</TabsTrigger>
                        <TabsTrigger value="badges" className="data-[state=active]:text-orange-500 data-[state=active]:bg-white/5 px-4 h-9 rounded-full transition-all">Badges</TabsTrigger>
                        {isAdmin && (
                          <TabsTrigger value="databank" className="data-[state=active]:text-orange-500 data-[state=active]:bg-white/5 px-4 h-9 rounded-full transition-all">Databank</TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-sm font-bold">{user.username}</span>
                      <span className="text-[10px] text-orange-500 uppercase tracking-widest font-black">{user.role}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => logout()} className="hover:text-orange-500 transition-colors">
                      Logout
                    </Button>
                  </div>
                </div>
              </header>

              <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsContent value="home" className="space-y-8 mt-0 outline-none">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card className="bg-[#111] border-white/5 shadow-2xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-orange-500/50 flex items-center gap-2">
                            <UserIcon className="w-3 h-3" /> Account Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase font-bold">Username</label>
                            <p className="text-lg font-bold">{user.username}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase font-bold">UID</label>
                            <p className="text-lg font-bold">#{user.id}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase font-bold">Joined</label>
                            <p className="text-lg font-bold">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#111] border-white/5 shadow-2xl md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-orange-500/50 flex items-center gap-2">
                            <Shield className="w-3 h-3" /> Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-8 pt-4">
                          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                            <p className="text-4xl font-black text-orange-500">{user.views || 0}</p>
                            <p className="text-[10px] text-gray-500 uppercase mt-2 font-black tracking-widest">Total Views</p>
                          </div>
                          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                            <p className="text-4xl font-black text-green-500">LIVE</p>
                            <p className="text-[10px] text-gray-500 uppercase mt-2 font-black tracking-widest">Profile Status</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="profile" className="mt-0 outline-none">
                    <Card className="bg-[#111] border-white/5 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl font-black flex items-center gap-3">
                          <Settings className="text-orange-500" /> Profile Editor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Display Name</label>
                            <Input value={localProfile?.displayName || ""} onChange={(e) => updateLocal("displayName", e.target.value)} className="bg-black border-white/5 focus:border-orange-500" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Location</label>
                            <Input value={localProfile?.location || ""} onChange={(e) => updateLocal("location", e.target.value)} className="bg-black border-white/5 focus:border-orange-500" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Background URL (Image/GIF)</label>
                            <div className="flex gap-2">
                              <Input value={localProfile?.backgroundUrl || ""} onChange={(e) => updateLocal("backgroundUrl", e.target.value)} placeholder="https://example.com/bg.gif" className="bg-black border-white/5 focus:border-orange-500" />
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/10 hover:bg-white/5 shrink-0"
                                onClick={() => document.getElementById('background-upload')?.click()}
                                disabled={isBannerUploading}
                              >
                                {isBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              </Button>
                              <input 
                                id="background-upload"
                                type="file" 
                                accept="image/png,image/jpeg,image/gif"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const result = await uploadFile(file);
                                      if (result) {
                                        updateLocal("backgroundUrl", result.objectPath);
                                        toast({ title: "Background uploaded" });
                                      }
                                    } catch (err) {
                                      toast({ title: "Upload failed", variant: "destructive" });
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Banner URL</label>
                            <div className="flex gap-2">
                              <Input value={localProfile?.bannerUrl || ""} onChange={(e) => updateLocal("bannerUrl", e.target.value)} placeholder="https://example.com/banner.png" className="bg-black border-white/5 focus:border-orange-500" />
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/10 hover:bg-white/5 shrink-0"
                                onClick={() => document.getElementById('banner-upload')?.click()}
                                disabled={isBannerUploading}
                              >
                                {isBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              </Button>
                              <input 
                                id="banner-upload"
                                type="file" 
                                accept="image/png,image/jpeg,image/gif"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const result = await uploadFile(file);
                                      if (result) {
                                        updateLocal("bannerUrl", result.objectPath);
                                        toast({ title: "Banner uploaded" });
                                      }
                                    } catch (err) {
                                      toast({ title: "Upload failed", variant: "destructive" });
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400">Bio (Supports Markdown)</label>
                          <Textarea value={localProfile?.bio || ""} onChange={(e) => updateLocal("bio", e.target.value)} className="min-h-[150px] bg-black border-white/5 focus:border-orange-500" />
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="font-bold">Reveal Screen</p>
                            <p className="text-xs text-gray-500">Enable an animated reveal screen on your profile</p>
                          </div>
                          <Switch checked={!!localProfile?.revealEnabled} onCheckedChange={(val) => updateLocal("revealEnabled", val)} />
                        </div>
                        <div className="pt-4 border-t border-white/5 flex gap-4">
                          <Button onClick={handleSave} disabled={profileMutation.isPending} className="bg-orange-500 text-black font-black hover:bg-orange-600">
                            {profileMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Save Changes"}
                          </Button>
                          <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 text-white font-bold">
                            <a href={`/${user.username}`} target="_blank" rel="noreferrer">View Profile</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="options" className="mt-0 outline-none">
                    <Card className="bg-[#111] border-white/5 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-xl font-black flex items-center gap-3">
                          <Grid className="text-orange-500" /> Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Avatar URL</label>
                            <div className="flex gap-2">
                              <Input value={localProfile?.avatarUrl || ""} onChange={(e) => updateLocal("avatarUrl", e.target.value)} placeholder="https://example.com/avatar.png" className="bg-black border-white/5" />
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="border-white/10 hover:bg-white/5 shrink-0"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                disabled={isBannerUploading}
                              >
                                {isBannerUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              </Button>
                              <input 
                                id="avatar-upload"
                                type="file" 
                                accept="image/png,image/jpeg,image/gif"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const result = await uploadFile(file);
                                      if (result) {
                                        updateLocal("avatarUrl", result.objectPath);
                                        toast({ title: "Avatar uploaded" });
                                      }
                                    } catch (err) {
                                      toast({ title: "Upload failed", variant: "destructive" });
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400">Theme Color</label>
                            <Input type="color" value={localProfile?.themeColor || "#F97316"} onChange={(e) => updateLocal("themeColor", e.target.value)} className="bg-black border-white/5 h-10 p-1" />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          {[
                            { label: "Show Views", field: "showViews" },
                            { label: "Show UID", field: "showUid" },
                            { label: "Show Join Date", field: "showJoinDate" },
                            { label: "Show Watermark", field: "showWatermark" }
                          ].map(({ label, field }) => (
                            <div key={field} className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                              <p className="font-bold">{label}</p>
                              <Switch checked={!!localProfile?.[field]} onCheckedChange={(val) => updateLocal(field, val)} />
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 flex gap-4">
                          <Button onClick={handleSave} disabled={profileMutation.isPending} className="bg-orange-500 text-black font-black hover:bg-orange-600">
                            Save Options
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="badges" className="mt-0 outline-none">
                    <Card className="bg-[#111] border-white/5 shadow-2xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-black flex items-center gap-3">
                          <Award className="text-orange-500" /> Platform Badges
                        </CardTitle>
                        {isAdmin && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="border-orange-500/20 text-orange-500 hover:bg-orange-500/10">
                                + Create New
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#111] border-white/5 text-white">
                              <DialogHeader>
                                <DialogTitle>Create New Badge</DialogTitle>
                              </DialogHeader>
                              <BadgeEditor />
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {badges?.map((badge: any) => {
                            const isOwned = (user.badges || []).includes(badge.name);
                            return (
                              <div key={badge.id} className={`p-6 bg-black/40 rounded-2xl border ${isOwned ? 'border-orange-500/50' : 'border-white/5 opacity-50'} flex flex-col items-center justify-center gap-3 group hover:border-orange-500/50 transition-all relative overflow-visible`}>
                                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform">
                                  {badge?.icon?.startsWith('http') ? (
                                    <img src={badge.icon} alt={badge.name} className="w-8 h-8 object-contain" />
                                  ) : (
                                    badge.icon
                                  )}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/50 group-hover:text-orange-500 transition-colors text-center">
                                  {badge.name}
                                </span>
                                {isAdmin && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Settings className="w-3 h-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#111] border-white/5 text-white">
                                      <DialogHeader>
                                        <DialogTitle>Edit Badge: {badge.name}</DialogTitle>
                                      </DialogHeader>
                                      <BadgeEditor badge={badge} />
                                    </DialogContent>
                                  </Dialog>
                                )}
                                {isOwned && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center border-2 border-[#111]">
                                    <span className="text-[8px] text-black font-black">✓</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {isAdmin && (
                    <TabsContent value="databank" className="mt-0 outline-none">
                      <Card className="bg-[#111] border-white/5 shadow-2xl overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-xl font-black flex items-center gap-3">
                            <Database className="text-orange-500" /> User Databank
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-black/40 text-[10px] uppercase tracking-widest font-black text-gray-500">
                                <tr>
                                  <th className="px-6 py-4">UID</th>
                                  <th className="px-6 py-4">Username</th>
                                  <th className="px-6 py-4">Role</th>
                                  <th className="px-6 py-4">Views</th>
                                  <th className="px-6 py-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {adminUsers?.map((u: any) => (
                                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-gray-500">#{u.id}</td>
                                    <td className="px-6 py-4 font-bold">{u.username}</td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase ${u.role === 'owner' ? 'bg-red-500/20 text-red-500' : u.role === 'admin' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/10 text-gray-400'}`}>
                                        {u.role}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{u.views}</td>
                                    <td className="px-6 py-4">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button size="sm" variant="ghost" className="text-xs hover:text-orange-500 flex items-center gap-2">
                                            <UserCog className="w-3 h-3" /> Manage
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-[#111] border-white/5 text-white">
                                          <DialogHeader>
                                            <DialogTitle>Manage User: {u.username}</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-6 py-4">
                                            <div className="space-y-3">
                                              <label className="text-[10px] uppercase font-black tracking-widest text-orange-500/50">Manage Badges</label>
                                              <div className="grid grid-cols-2 gap-2">
                                                {badges?.map((badge: any) => (
                                                  <div key={badge.id} className="flex items-center space-x-2 bg-black/40 p-2 rounded border border-white/5 group/badge">
                                                    <Checkbox 
                                                      id={`badge-${u.id}-${badge.name}`} 
                                                      checked={(u.badges || []).includes(badge.name)}
                                                      onCheckedChange={(checked) => {
                                                        const currentBadges = u.badges || [];
                                                        const newBadges = checked 
                                                          ? [...currentBadges, badge.name]
                                                          : currentBadges.filter((b: string) => b !== badge.name);
                                                        
                                                        apiRequest("PATCH", `/api/admin/users/${u.id}`, { badges: newBadges })
                                                          .then(() => {
                                                            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                                                            toast({ title: "Badges updated" });
                                                          });
                                                      }}
                                                    />
                                                    <div className="flex-1 flex items-center justify-between gap-1 overflow-hidden">
                                                      <span className="text-xs font-bold truncate">{badge.icon} {badge.name}</span>
                                                      <Dialog>
                                                        <DialogTrigger asChild>
                                                          <Button size="icon" variant="ghost" className="h-4 w-4 opacity-0 group-hover/badge:opacity-100 transition-opacity">
                                                            <Settings className="w-2 h-2" />
                                                          </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-[#111] border-white/5 text-white">
                                                          <DialogHeader>
                                                            <DialogTitle>Edit Badge: {badge.name}</DialogTitle>
                                                          </DialogHeader>
                                                          <BadgeEditor badge={badge} />
                                                        </DialogContent>
                                                      </Dialog>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                              <Dialog>
                                                <DialogTrigger asChild>
                                                  <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-white/10 mt-2">
                                                    + Create New Badge
                                                  </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#111] border-white/5 text-white">
                                                  <DialogHeader>
                                                    <DialogTitle>Create New Badge</DialogTitle>
                                                  </DialogHeader>
                                                  <BadgeEditor />
                                                </DialogContent>
                                              </Dialog>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-white/5 space-y-3">
                                              <label className="text-[10px] uppercase font-black tracking-widest text-red-500/50">Danger Zone</label>
                                              <Button 
                                                variant="destructive" 
                                                className="w-full flex items-center justify-center gap-2"
                                                onClick={() => {
                                                  if (confirm(`Are you sure you want to ban ${u.username}?`)) {
                                                    apiRequest("PATCH", `/api/admin/users/${u.id}`, { role: "banned" })
                                                      .then(() => {
                                                        queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                                                        toast({ title: "User banned" });
                                                      });
                                                  }
                                                }}
                                              >
                                                <Ban className="w-4 h-4" /> Ban User Account
                                              </Button>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </main>
            </div>
          );
        }
