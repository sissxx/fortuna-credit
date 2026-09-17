// No backend/database exists in this project (see architecture analysis).
// Persistence for saved posts and templates uses localStorage, scoped to
// the admin's browser. Swapping this for a real API later means replacing
// only this file — components call these functions, never localStorage
// directly.
import { genId, type GeneratedPost, type Template } from "./types";

const POSTS_KEY = "fortuna-admin-ig-posts";
const TEMPLATES_KEY = "fortuna-admin-ig-templates";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listPosts(): GeneratedPost[] {
  return read<GeneratedPost>(POSTS_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function savePost(post: GeneratedPost) {
  const posts = read<GeneratedPost>(POSTS_KEY);
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) posts[idx] = post;
  else posts.push(post);
  write(POSTS_KEY, posts);
}

export function deletePost(id: string) {
  write(
    POSTS_KEY,
    read<GeneratedPost>(POSTS_KEY).filter((p) => p.id !== id)
  );
}

export function duplicatePost(id: string): GeneratedPost | null {
  const posts = read<GeneratedPost>(POSTS_KEY);
  const source = posts.find((p) => p.id === id);
  if (!source) return null;
  const copy: GeneratedPost = {
    ...source,
    id: genId("post"),
    createdAt: new Date().toISOString(),
    status: "draft",
  };
  posts.push(copy);
  write(POSTS_KEY, posts);
  return copy;
}

export function listTemplates(): Template[] {
  return read<Template>(TEMPLATES_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveTemplate(template: Template) {
  const templates = read<Template>(TEMPLATES_KEY);
  const idx = templates.findIndex((t) => t.id === template.id);
  if (idx >= 0) templates[idx] = template;
  else templates.push(template);
  write(TEMPLATES_KEY, templates);
}

export function deleteTemplate(id: string) {
  write(
    TEMPLATES_KEY,
    read<Template>(TEMPLATES_KEY).filter((t) => t.id !== id)
  );
}
