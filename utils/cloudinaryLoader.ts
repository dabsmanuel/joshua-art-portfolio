import type { ImageLoaderProps } from 'next/image';

const UPLOAD_MARKER = '/image/upload/';
// getOptimizedImageUrl() may already have added this to the URL
const AUTO_SEGMENT = 'f_auto,q_auto/';

// Artwork and exhibition images live on Cloudinary, which can resize and compress them itself.
// Loading them straight from Cloudinary avoids Next fetching every original on the server first
// (that extra hop is what produced "upstream image response timed out" on slow connections).
// Anything that is not a Cloudinary upload (local files, blob: previews) is returned untouched.
export const cloudinaryLoader = ({ src, width }: ImageLoaderProps): string => {
  if (!src.includes('res.cloudinary.com') || !src.includes(UPLOAD_MARKER)) return src;

  const [head, ...rest] = src.split(UPLOAD_MARKER);
  let tail = rest.join(UPLOAD_MARKER);
  if (tail.startsWith(AUTO_SEGMENT)) tail = tail.slice(AUTO_SEGMENT.length);

  return `${head}${UPLOAD_MARKER}f_auto,q_auto,w_${width}/${tail}`;
};
