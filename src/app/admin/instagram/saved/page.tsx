"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { listPosts, deletePost, duplicatePost, savePost } from "@/lib/instagram/storage";
import { POST_TYPE_LABELS, formatById, type GeneratedPost, type PostStatus } from "@/lib/instagram/types";

const STATUS_VARIANT: Record<PostStatus, "gold" | "success" | "dark"> = {
  draft: "dark",
  ready: "gold",
  published: "success",
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(listPosts());
  }, []);

  function refresh() {
    setPosts(listPosts());
  }

  function handleDelete(id: string) {
    deletePost(id);
    refresh();
    showToast("Post deleted.", "info");
  }

  function handleDuplicate(id: string) {
    duplicatePost(id);
    refresh();
    showToast("Post duplicated.", "success");
  }

  function handleStatusChange(post: GeneratedPost, status: PostStatus) {
    savePost({ ...post, status });
    refresh();
  }

  function handleDownload(post: GeneratedPost) {
    if (!post.thumbnail) return;
    downloadDataUrl(post.thumbnail, `${post.campaignName || "fortuna-post"}-${post.variation.layoutPresetId}.jpg`);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-brand text-2xl text-brand-black">Saved Posts</p>
          <p className="mt-1 text-sm text-brand-gray/60">{posts.length} saved locally in this browser.</p>
        </div>
        <Button href="/admin/instagram">New Post</Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-10 text-center text-sm text-brand-gray/60">
          No saved posts yet. Generate one from the Instagram Generator.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const format = formatById(post.formatId);
            return (
              <div key={post.id} className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.campaignName}
                    width={format.width}
                    height={format.height}
                    unoptimized
                    className="w-full object-cover"
                    style={{ aspectRatio: `${format.width} / ${format.height}` }}
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-brand-black text-xs text-brand-muted">No preview</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-black">{post.campaignName || "Untitled campaign"}</p>
                    <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-brand-gray/60">
                    {POST_TYPE_LABELS[post.postType]} · {format.label} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-brand-gray/70">{post.copy.caption}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/admin/instagram?postId=${post.id}`} className="text-xs font-semibold text-brand-gold underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDuplicate(post.id)} className="text-xs font-semibold text-brand-gray underline">
                      Duplicate
                    </button>
                    <button onClick={() => handleDownload(post)} className="text-xs font-semibold text-brand-gray underline">
                      Download
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="text-xs font-semibold text-red-600 underline">
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 flex gap-1.5">
                    {(["draft", "ready", "published"] as PostStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(post, s)}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
                          post.status === s ? "border-brand-gold bg-brand-gold/10 text-brand-black" : "border-black/10 text-brand-gray/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
