import { extname } from "path";

/* =========================
 *  FILE EXTENSIONS
 * ========================= */

export const imageExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',
  '.tiff', '.ico', '.jfif', '.pjpeg', '.pjp', '.avif'
];

export const videoExtensions = [
  '.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm',
  '.mpeg', '.mpg', '.3gp', '.3g2', '.mts', '.m2ts', '.vob',
  '.ogv', '.ts', '.m4v'
];

export const audioExtensions = [
  '.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a', '.amr', '.aiff', '.wma'
];

export const documentExtensions = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf',
  '.odt', '.ods', '.odp', '.md', '.csv', '.json', '.xml', '.yml', '.yaml',
  '.epub', '.js', '.ts', '.html', '.css', '.c', '.cpp', '.h', '.hpp', '.py',
  '.java', '.cs', '.go', '.rb', '.php', '.swift', '.rs'
];

export const archiveExtensions = [
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.cab',
  '.lz', '.lzma', '.z', '.tgz', '.txz'
];

export const stickerExtensions = [
  '.webp', '.tgs', '.gif'
];

/* =========================
 *  MIME TYPE LIST
 * ========================= */
export const mimeTypes: [string, string][] = [
  // === Images ===
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.bmp', 'image/bmp'],
  ['.tiff', 'image/tiff'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],

  // === Videos ===
  ['.mp4', 'video/mp4'],
  ['.avi', 'video/x-msvideo'],
  ['.mov', 'video/quicktime'],
  ['.mkv', 'video/x-matroska'],
  ['.flv', 'video/x-flv'],
  ['.wmv', 'video/x-ms-wmv'],
  ['.webm', 'video/webm'],
  ['.mpeg', 'video/mpeg'],
  ['.mpg', 'video/mpeg'],

  // === Audios ===
  ['.mp3', 'audio/mpeg'],
  ['.wav', 'audio/wav'],
  ['.aac', 'audio/aac'],
  ['.flac', 'audio/flac'],
  ['.ogg', 'audio/ogg'],
  ['.m4a', 'audio/mp4'],
  ['.amr', 'audio/amr'],
  ['.wma', 'audio/x-ms-wma'],

  // === Documents ===
  ['.pdf', 'application/pdf'],
  ['.doc', 'application/msword'],
  ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['.xls', 'application/vnd.ms-excel'],
  ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['.ppt', 'application/vnd.ms-powerpoint'],
  ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['.txt', 'text/plain'],
  ['.md', 'text/markdown'],
  ['.csv', 'text/csv'],
  ['.json', 'application/json'],
  ['.xml', 'application/xml'],
  ['.yaml', 'application/yaml'],
  ['.yml', 'application/yaml'],
  ['.html', 'text/html'],
  ['.css', 'text/css'],
  ['.js', 'application/javascript'],
  ['.ts', 'application/typescript'],
  ['.java', 'text/x-java-source'],
  ['.py', 'text/x-python'],
  ['.rb', 'text/x-ruby'],
  ['.go', 'text/x-go-source'],
  ['.php', 'application/x-httpd-php'],
  ['.c', 'text/x-c'],
  ['.cpp', 'text/x-c'],
  ['.cs', 'text/x-csharp'],
  ['.swift', 'text/x-swift'],
  ['.rs', 'text/x-rust'],

  // === Archives ===
  ['.zip', 'application/zip'],
  ['.rar', 'application/vnd.rar'],
  ['.7z', 'application/x-7z-compressed'],
  ['.tar', 'application/x-tar'],
  ['.gz', 'application/gzip'],
  ['.bz2', 'application/x-bzip2'],
  ['.xz', 'application/x-xz'],
  ['.tgz', 'application/x-tar'],
  ['.iso', 'application/x-iso9660-image'],

  // === Stickers ===
  ['.webp', 'image/webp'],
  ['.tgs', 'application/x-tgs'],
  ['.gif', 'image/gif']
];

/* =========================
 *  FUNCTIONS
 * ========================= */

// MIME type aniqlash
export function getMimeType(fileName: string): string {
  const ext = extname(fileName).toLowerCase();
  const found = mimeTypes.find(([key]) => key === ext);
  return found?.[1] || 'application/octet-stream';
}

// Field name ajratish (message uchun)
export function getFieldName(fileName: string): string {
  const ext = extname(fileName).toLowerCase();

  if (imageExtensions.includes(ext)) {
    if (stickerExtensions.includes(ext)) return 'stickers';
    return 'images';
  }
  if (videoExtensions.includes(ext)) return 'videos';
  if (audioExtensions.includes(ext)) return 'audios';
  if (documentExtensions.includes(ext)) return 'docs';
  if (archiveExtensions.includes(ext)) return 'files';
  return 'files';
}

/* =========================
 *  GROUP BY FIELD (optional)
 * ========================= */
export function groupFilesByField(files?: Express.Multer.File[] | null) {
  if (!files || !Array.isArray(files)) return {};

  const result: Record<string, string[]> = {};

  for (const file of files) {
    const field = getFieldName(file.originalname);
    if (!result[field]) result[field] = [];
    result[field].push(file.path);
  }

  return result;
}
