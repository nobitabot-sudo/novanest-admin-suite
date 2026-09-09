import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file to the media bucket and returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError) throw signError;

  return data.signedUrl;
}

/** Extracts the storage path back out of a signed media URL. */
export function mediaPathFromUrl(url: string): string | null {
  const match = url.match(/\/object\/(?:sign|public)\/media\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function deleteMedia(url: string) {
  const path = mediaPathFromUrl(url);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
