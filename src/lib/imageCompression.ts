// Client-side image compression for JPEG/PNG/WebP before uploading.
// Uses a canvas to downscale and re-encode to WebP (fallback JPEG).
// HEIC/HEIF and PDFs are returned untouched.

export interface CompressOptions {
  maxDimension?: number; // longest edge in px
  quality?: number; // 0..1
  mimeType?: "image/webp" | "image/jpeg";
}

const DEFAULTS: Required<CompressOptions> = {
  maxDimension: 2000,
  quality: 0.82,
  mimeType: "image/webp",
};

const COMPRESSIBLE = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export async function compressImageIfPossible(
  file: File,
  opts: CompressOptions = {},
): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!COMPRESSIBLE.has(file.type)) return file;

  const { maxDimension, quality, mimeType } = { ...DEFAULTS, ...opts };

  try {
    const bitmap = await loadBitmap(file);
    const { width, height } = fitWithin(bitmap.width, bitmap.height, maxDimension);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, mimeType, quality),
    );
    if (!blob) return file;

    // Only replace when the compressed version is actually smaller.
    if (blob.size >= file.size) return file;

    const ext = mimeType === "image/webp" ? ".webp" : ".jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}${ext}`, { type: blob.type, lastModified: Date.now() });
  } catch {
    return file;
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through */
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function fitWithin(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = w >= h ? max / w : max / h;
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
