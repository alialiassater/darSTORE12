import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBook } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/queryClient";

export function useBooks(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: [api.books.list.path, filters],
    queryFn: async () => {
      const url = new URL(apiUrl(api.books.list.path), window.location.origin);
      if (filters?.category && filters.category !== "all") url.searchParams.append("category", filters.category);
      if (filters?.search) url.searchParams.append("search", filters.search);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch books");
      return await res.json();
    },
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: [api.books.get.path, id],
    queryFn: async () => {
      const url = apiUrl(buildUrl(api.books.get.path, { id }));
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch book");
      return await res.json();
    },
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertBook) => {
      const res = await fetch(apiUrl(api.books.create.path), {
        method: api.books.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create book");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
      toast({ title: "Success", description: "Book created successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertBook>) => {
      const url = apiUrl(buildUrl(api.books.update.path, { id }));
      const res = await fetch(url, {
        method: api.books.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update book");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
      toast({ title: "Success", description: "Book updated successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = apiUrl(buildUrl(api.books.delete.path, { id }));
      const res = await fetch(url, { method: api.books.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete book");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
      toast({ title: "Success", description: "Book deleted successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
