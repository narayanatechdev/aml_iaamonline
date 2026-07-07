export const COVER_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const COVER_IMAGE_ACCEPT = 'image/jpeg,image/png';
export const COVER_IMAGE_HELP_TEXT = 'JPG or PNG · required · 16:9 ratio · under 10 MB';
export const GRAPHICAL_ABSTRACT_MAX_BYTES = 5 * 1024 * 1024;
export const GRAPHICAL_ABSTRACT_ACCEPT = 'image/jpeg,image/png';
export const GRAPHICAL_ABSTRACT_HELP_TEXT = 'JPG or PNG · required · max 5 MB';

const COVER_IMAGE_RATIO = 16 / 9;
const COVER_IMAGE_RATIO_TOLERANCE = 0.01;
const COVER_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export function validateCoverImageFile(file: File): Promise<string | null> {
  if (!COVER_IMAGE_TYPES.includes(file.type)) {
    return Promise.resolve('Cover image must be a JPG or PNG file.');
  }

  if (file.size > COVER_IMAGE_MAX_BYTES) {
    return Promise.resolve('Cover image must be under 10 MB.');
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const ratio = image.naturalWidth / image.naturalHeight;
      const validRatio = Number.isFinite(ratio) && Math.abs(ratio - COVER_IMAGE_RATIO) <= COVER_IMAGE_RATIO_TOLERANCE;
      resolve(validRatio ? null : 'Cover image must use a 16:9 ratio.');
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('Cover image could not be read. Please upload a valid JPG or PNG file.');
    };

    image.src = objectUrl;
  });
}


export function validateGraphicalAbstractFile(file: File): Promise<string | null> {
  if (!COVER_IMAGE_TYPES.includes(file.type)) {
    return Promise.resolve('Graphical Abstract must be a JPG or PNG file.');
  }

  if (file.size > GRAPHICAL_ABSTRACT_MAX_BYTES) {
    return Promise.resolve('Graphical Abstract must be under 5 MB.');
  }

  return Promise.resolve(null);
}
