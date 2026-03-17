import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogArticle,
  CommunityPost,
  CropSnapshot,
  UserProfile,
} from "../backend";
import { UserRole } from "../backend";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogArticle[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogArticle[]>({
    queryKey: ["articles", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllArticles();
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerCrops() {
  const { actor, isFetching } = useActor();
  return useQuery<CropSnapshot[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerCrops();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCoreValues() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["coreValues"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCoreValues();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCommunityPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useAddCropSnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (crop: CropSnapshot) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCropSnapshot(crop);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
      await actor.initialize();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
