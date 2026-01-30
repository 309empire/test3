import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertLink } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useLinks() {
  return useQuery({
    queryKey: [api.links.list.path],
    queryFn: async () => {
      const res = await fetch(api.links.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch links");
      return api.links.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (link: InsertLink) => {
      const res = await fetch(api.links.create.path, {
        method: api.links.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(link),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create link");
      return api.links.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
      toast({ title: "Link created" });
    },
    onError: () => toast({ title: "Failed to create link", variant: "destructive" }),
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertLink>) => {
      const url = buildUrl(api.links.update.path, { id });
      const res = await fetch(url, {
        method: api.links.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update link");
      return api.links.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
      toast({ title: "Link updated" });
    },
    onError: () => toast({ title: "Failed to update link", variant: "destructive" }),
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.links.delete.path, { id });
      const res = await fetch(url, { method: api.links.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete link");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
      toast({ title: "Link deleted" });
    },
    onError: () => toast({ title: "Failed to delete link", variant: "destructive" }),
  });
}

export function useReorderLinks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: { id: number; order: number }[]) => {
      const res = await fetch(api.links.reorder.path, {
        method: api.links.reorder.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reorder");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.links.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.profiles.me.path] });
    },
    onError: () => toast({ title: "Reorder failed", variant: "destructive" }),
  });
}
