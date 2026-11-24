// Cloudinary serves resized/re-encoded variants by inserting a transformation
// segment after "/upload/" in the delivery URL. Non-Cloudinary URLs pass through.
const UPLOAD_SEGMENT = '/upload/';

export const isCloudinaryUrl = (url = '') =>
  /^https:\/\/res\.cloudinary\.com\//.test(url) && url.includes(UPLOAD_SEGMENT);

export const cloudinaryTransform = (url, transformation) => {
  if (!url || !isCloudinaryUrl(url)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transformation}/`);
};

// Covers are uploaded as near-lossless masters; every variant below is derived
// from the master in a single lossy step.

// Post banner: best format the browser supports (AVIF/WebP) at Cloudinary's
// "good" automatic quality, so visitors never download the heavier master.
export const bannerUrl = (url) => cloudinaryTransform(url, 'f_auto,q_auto:good');

// Card thumbnail: 2x of the ~320px-wide card, 1200x630 aspect ratio.
export const thumbnailUrl = (url) => cloudinaryTransform(url, 'c_fill,w_640,h_336,f_auto,q_auto');

// Social cards: some scrapers (LinkedIn, older Facebook) don't accept WebP, so
// serve a 1200x630 JPEG. q_85:444 keeps full colour resolution; the default
// 4:2:0 chroma subsampling visibly blurs coloured text on title cards.
export const socialImageUrl = (url) => cloudinaryTransform(url, 'c_fill,w_1200,h_630,f_jpg,q_85:444');
