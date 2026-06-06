type CloudinaryImageOptions = {
  width?: number
  quality?: string
}

const CLOUDINARY_HOSTNAME = 'res.cloudinary.com'
const CLOUDINARY_UPLOAD_PATH = '/image/upload/'

export function getOptimizedCloudinaryUrl(
  imageUrl: string,
  options: CloudinaryImageOptions = {},
): string {
  if (!imageUrl) {
    return imageUrl
  }

  try {
    const url = new URL(imageUrl)
    const uploadPathIndex = url.pathname.indexOf(CLOUDINARY_UPLOAD_PATH)

    if (url.hostname !== CLOUDINARY_HOSTNAME || uploadPathIndex === -1) {
      return imageUrl
    }

    const transformations = [
      'f_auto',
      `q_${options.quality ?? 'auto:good'}`,
      'c_limit',
    ]

    if (options.width && Number.isFinite(options.width) && options.width > 0) {
      transformations.push(`w_${Math.round(options.width)}`)
    }

    const insertionIndex = uploadPathIndex + CLOUDINARY_UPLOAD_PATH.length
    url.pathname = [
      url.pathname.slice(0, insertionIndex),
      transformations.join(','),
      '/',
      url.pathname.slice(insertionIndex),
    ].join('')

    return url.toString()
  } catch {
    return imageUrl
  }
}

export function getCloudinarySrcSet(
  imageUrl: string,
  widths: number[],
  quality?: string,
): string | undefined {
  if (!imageUrl.includes(CLOUDINARY_HOSTNAME)) {
    return undefined
  }

  return widths
    .map(
      (width) =>
        `${getOptimizedCloudinaryUrl(imageUrl, { width, quality })} ${width}w`,
    )
    .join(', ')
}
