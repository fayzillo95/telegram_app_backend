import { ConfigService } from "@nestjs/config";
import { EmailCodeEnum } from "./enum.types";
import { extname, join } from "path";
import { archiveExtensions, documentExtensions, getMimeType, imageExtensions, videoExtensions } from "./filter.file.types";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { Response } from "express";
import { stat } from "fs/promises";
import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import { writeFileSync } from 'fs';

export function urlGenerator(config: ConfigService, param: string): string {
  const extract = extname(param).toLowerCase();

  let serverPath: string;
  if (imageExtensions.includes(extract)) {
    serverPath = "image";
  } else if (videoExtensions.includes(extract)) {
    serverPath = "video";
  } else if (archiveExtensions.includes(extract)) {
    serverPath = "archive";
  } else {
    serverPath = "docs";
  }
  console.log(config)
  const host = config.get<string>("HOST");
  const port = config.get<string>("PORT");
  // Xato tuzatildi: http
  const baseUrl = config.get<string>("APP_BASE_URL") || `http://${host}:${port}`;

  return `api/${serverPath}/${param}`;
}

export function messageGenerator(
  typeMessage: EmailCodeEnum = EmailCodeEnum.REGISTER,
  code: number
): string {
  // Xato tuzatildi: verify
  return `<h1>Your ${typeMessage} verify code 🧐🧐🧐</h1>
            <p>Code: ${code}</p>`;
}

// Yarim qolgan funksiya o'chirildi - kerak emas

export function getPathInFileType(fileName: string): string {
  const extract = extname(fileName).toLowerCase();
  let filePath: string;

  if (imageExtensions.includes(extract)) {
    filePath = join(process.cwd(), "uploads", "images");
  } else if (videoExtensions.includes(extract)) {
    filePath = join(process.cwd(), "uploads", "videos");
  } else if (documentExtensions.includes(extract)) {
    filePath = join(process.cwd(), "uploads", "docs");
  } else if (archiveExtensions.includes(extract)) {
    // Xato tuzatildi: archive
    filePath = join(process.cwd(), "uploads", "archive");
  } else {
    filePath = join(process.cwd(), "uploads", "unknown");
  }

  if (!existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }

  return filePath;
}

export async function headerDataStream(
  res: Response,
  filePath: string,
  fileName: string
): Promise<void> {
  try {
    // Fayl mavjudligini tekshirish
    if (!existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileSize = (await stat(filePath)).size;
    const range = res.req.headers.range;
    const mimeType = getMimeType(fileName);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Range validation
      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).json({ error: 'Range not satisfiable' });
        return;
      }

      const chunkSize = end - start + 1;
      const file = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      file.pipe(res);

      // Error handling for stream
      file.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });

    } else {
      const file = createReadStream(filePath);

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });

      file.pipe(res);

      // Error handling for stream
      file.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    }

  } catch (error) {
    console.error('File streaming error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


export class ImageGenerator {

  private readonly width: number = 300;
  private readonly height: number = 300;
  private readonly fontSize: number = 50;

  constructor(private readonly config : ConfigService){

  }
  /**
   * Random rang olish
   */
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
      '#F1948A', '#85C1E9', '#D7BDE2', '#A9DFBF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Matnning kontrastli rangini aniqlash
   */
  private getContrastColor(backgroundColor: string): string {
    // Hex rangni RGB ga o'zgartirish
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Brightness hisoblash
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  /**
   * Avatar rasmi yaratish
   */
  public generateAvatar(text: string,config : ConfigService): string {
    // Faqat birinchi 2 ta harfni olish
    const initials = text.substring(0, 2).toUpperCase();

    // Canvas yaratish
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    // Random fon rangi
    const backgroundColor = this.getRandomColor();
    const textColor = this.getContrastColor(backgroundColor);

    // Fonni to'ldirish
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Matn sozlamalari
    ctx.fillStyle = textColor;
    ctx.font = `bold ${this.fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Matnni markazda joylashtirish
    const x = this.width / 2;
    const y = this.height / 2;

    ctx.fillText(initials, x, y);

    // Agar outputPath berilgan bo'lsa, faylga saqlash
    const fileName = `avatar_${initials.toLowerCase()}_${Date.now()}.png`;
    const outputPath = getPathInFileType(fileName)
    const fullPath = join(outputPath, fileName);
    writeFileSync(fullPath, canvas.toBuffer('image/png'));

    // Buffer qaytarish
    return urlGenerator(config ,fileName);
  }

}
