/**
 * Base URL for static assets served from Vercel Blob storage.
 * All files previously in public/ are now hosted here.
 */
const BLOB_STORAGE_URL =
  process.env.NEXT_PUBLIC_BLOB_STORAGE_URL ||
  'https://7fzwxvblhjtadxkp.public.blob.vercel-storage.com';

/**
 * Resolves an asset path to its full Vercel Blob URL.
 * - Full URLs (http/https) are returned unchanged
 * - Paths starting with / are prepended with the blob storage base URL
 * @param {string} path - Asset path (e.g. /images/profile-pic.png) or full URL
 * @returns {string} Full URL to the asset
 */
export function getAssetUrl(path) {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BLOB_STORAGE_URL}${normalizedPath}`;
}
