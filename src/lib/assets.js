/**
 * Base URL for static assets served from Vercel Blob storage.
 * All files previously in public/ are now hosted here.
 */
const BLOB_STORAGE_URL =
  process.env.NEXT_PUBLIC_BLOB_STORAGE_URL ||
  'https://7fzwxvblhjtadxkp.public.blob.vercel-storage.com';

/** Repo-local path under `public/` for Open Graph / Twitter preview (place logo.png here). */
export const SITE_METADATA_LOGO_PATH = '/metadata/logo.png';

/**
 * Public site origin for absolute meta URLs (og:image, etc.).
 * Set NEXT_PUBLIC_SITE_URL in env for correct previews in all environments.
 */
export function getSiteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return '';
}

/**
 * Absolute URL for the default social preview image, or the path alone if no origin is known.
 */
export function getMetadataImageAbsoluteUrl() {
  const origin = getSiteOrigin();
  const path = SITE_METADATA_LOGO_PATH;
  return origin ? `${origin}${path}` : path;
}

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
