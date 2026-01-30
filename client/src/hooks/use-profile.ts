import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProfile } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === Profile Hooks ===

export function useMyProfile() {
  return useQuery({
    queryKey: [api.profiles.me.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.me.path, { credentials: "include" });
      if (res.status === 404) return null; // No profile yet
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: [api.profiles.getByUsername.path, username],
    queryFn: async () => {
      const url = buildUrl(api.profiles.getByUsername.path, { username });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch public profile");
      return api.profiles.getByUsername.responses[200].parse(await res.json());
    },
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<InsertProfile>) => {
      const res = await fetch(api.profiles.update.path, {
        method: api.profiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      return api.profiles.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
      // Invalidate public profile query if we know the username, but difficult here without passing it.
      // Usually user is viewing their own preview.
      toast({ title: "Profile updated", description: "Changes saved successfully" });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Could not save changes", variant: "destructive" });
    },
  });
}
