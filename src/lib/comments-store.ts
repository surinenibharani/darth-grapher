import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

const BLOB_PATH = "photo-comments.json";
const LOCAL_PATH = resolve(process.cwd(), ".data/photo-comments.json");
const MAX_COMMENTS_PER_PHOTO = 100;

export interface PhotoComment {
  id: string;
  photoId: string;
  name: string;
  text: string;
  createdAt: string;
}

type CommentStore = Record<string, PhotoComment[]>;

function emptyStore(): CommentStore {
  return {};
}

function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readBlobStore(): Promise<CommentStore> {
  try {
    const { head } = await import("@vercel/blob");
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return emptyStore();
    return (await res.json()) as CommentStore;
  } catch {
    return emptyStore();
  }
}

async function writeBlobStore(store: CommentStore): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(store), {
    access: "private",
    allowOverwrite: true,
  });
}

function readLocalStore(): CommentStore {
  try {
    if (!existsSync(LOCAL_PATH)) return emptyStore();
    return JSON.parse(readFileSync(LOCAL_PATH, "utf8")) as CommentStore;
  } catch {
    return emptyStore();
  }
}

function writeLocalStore(store: CommentStore): void {
  mkdirSync(dirname(LOCAL_PATH), { recursive: true });
  writeFileSync(LOCAL_PATH, JSON.stringify(store, null, 2), "utf8");
}

/** Local file store works off Vercel; serverless production needs Blob. */
function canUseLocalFileStore(): boolean {
  return !process.env.VERCEL;
}

async function readStore(): Promise<CommentStore> {
  if (isBlobConfigured()) return readBlobStore();
  if (canUseLocalFileStore()) return readLocalStore();
  return emptyStore();
}

async function writeStore(store: CommentStore): Promise<boolean> {
  if (isBlobConfigured()) {
    await writeBlobStore(store);
    return true;
  }
  if (canUseLocalFileStore()) {
    writeLocalStore(store);
    return true;
  }
  return false;
}

export function isCommentsStorageConfigured(): boolean {
  return isBlobConfigured() || canUseLocalFileStore();
}

export async function getCommentsForPhoto(photoId: string): Promise<PhotoComment[]> {
  const store = await readStore();
  return store[photoId] ?? [];
}

export async function addComment(
  photoId: string,
  name: string,
  text: string
): Promise<PhotoComment | null> {
  if (!isCommentsStorageConfigured()) return null;

  const store = await readStore();
  const existing = store[photoId] ?? [];

  if (existing.length >= MAX_COMMENTS_PER_PHOTO) return null;

  const comment: PhotoComment = {
    id: crypto.randomUUID(),
    photoId,
    name,
    text,
    createdAt: new Date().toISOString(),
  };

  store[photoId] = [comment, ...existing];
  const saved = await writeStore(store);
  return saved ? comment : null;
}
