import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CoreValue {
    title: string;
    description: string;
}
export interface BlogArticle {
    title: string;
    body: string;
    summary: string;
    category: string;
}
export interface CropSnapshot {
    soilMoisture: bigint;
    temperature: bigint;
    name: string;
    expectedHarvest: string;
    variety: string;
    health: bigint;
}
export interface CommunityPost {
    content: string;
    author: string;
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export enum UserRole {
    ngo = "ngo",
    consumer = "consumer",
    farmer = "farmer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBlogArticle(article: BlogArticle): Promise<void>;
    addCommunityPost(content: string): Promise<void>;
    addCropSnapshot(crop: CropSnapshot): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    getAllArticles(): Promise<Array<BlogArticle>>;
    getAllPosts(): Promise<Array<CommunityPost>>;
    getArticlesByCategory(category: string): Promise<Array<BlogArticle>>;
    getCallerCrops(): Promise<Array<CropSnapshot>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCoreValues(): Promise<Array<CoreValue>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
