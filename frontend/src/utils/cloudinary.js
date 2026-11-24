// Cloudinary serves resized/re-encoded variants by inserting a transformation
// segment after "/upload/" in the delivery URL. Non-Cloudinary URLs pass through.
const UPLOAD_SEGMENT = '/upload/';

export const isCloudinaryUrl = (url = '') =>
  /^https:\/\/res\.cloudinary\.com\//.test(url) && url.includes(UPLOAD_SEGMENT);

export const cloudinaryTransform = (url, transformation) => {
  if (!url || !isCloudinaryUrl(url)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transformation}/`);
};

// Card thumbnail: 2x of the ~320px-wide card, 1200x630 aspect ratio.
export const thumbnailUrl = (url) => cloudinaryTransform(url, 'c_fill,w_640,h_336,f_auto,q_auto');

// Social cards: some scrapers (LinkedIn, older Facebook) don't accept WebP,
// so ask Cloudinary for a 1200x630 JPEG with known dimensions.
export const socialImageUrl = (url) => cloudinaryTransform(url, 'c_fill,w_1200,h_630,f_jpg,q_auto');
