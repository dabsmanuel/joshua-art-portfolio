/**
 * Utility functions for handling images and CDN transformations.
 */

/**
 * Optimizes Cloudinary URLs by automatically applying format (f_auto)
 * and quality (q_auto) transformations if not already present.
 */
export function getOptimizedImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (
    url.includes('res.cloudinary.com') &&
    url.includes('/upload/') &&
    !url.includes('/upload/f_auto') &&
    !url.includes('/upload/q_auto')
  ) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return url;
}

