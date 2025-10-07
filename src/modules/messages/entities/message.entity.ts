import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { JsonValue } from "@prisma/client/runtime/library";

interface returnMessageType {
    id: string;
    chatId : string,
    senderId: string;
    text: string | null;
    images: JsonValue;
    videos: JsonValue;
    docs: JsonValue;
    files: JsonValue;
    stickers: JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        chat: number;
        replyTo: number;
        replies: number;
        sender: number;
    };
    sender: {
        Profile: {
            id: string;
            avatar: string;
            firstName: string | null;
            lastName: string | null;
            privateUrl: string | null;
            publicUrl: string | null;
            bio: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        isBot: boolean;
        isDeleted: boolean;
        username: string | null;
        lastActivaty: Date;
    };
}

export const messageFindEntity = {
  sender: {
    include: {
      Profile: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          privateUrl: true,
          publicUrl: true,
          bio: true,
          id: true
        },
      }
    },
  },
  text: true,
  senderId: true,
  id: true,
  chatId : true,
  files: true,
  docs: true,
  createdAt: true,
  updatedAt: true,
  images: true,
  videos: true,
  stickers: true,
  _count: true
}


export const messageReturnData = (message:returnMessageType) => {
  const { _count, sender, docs, files, createdAt, id, images, senderId,chatId, stickers, text, updatedAt, videos } = message
  const { Profile, createdAt: userRegisteredAt, email, isBot, isDeleted, updatedAt: userUpdatedAt, username, lastActivaty } = sender
  const { avatar, firstName, lastName, privateUrl, publicUrl, id: profileId } = Profile[0]
  return {
    message: { text, files, images, videos, docs, stickers, updatedAt, senderId,chatId },
    sender: { firstName, lastName, username, id: senderId, publicUrl, privateUrl, avatar, profileId, email, isBot, lastActivaty }
  }
}



@Injectable()
export class MessagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 🔹 1. Kiruvchi message ma'lumotni tozalash / formatlash
    if (request.body) {
      const body = request.body;

      // Agar auth'dan foydalanuvchi kelsa, senderId'ni avtomatik qo'shamiz
      if (request.user && !body.senderId) {
        body.senderId = request.user.id;
      }

      // Fayl, media, sticker, docs kabilarni JSON string bo‘lsa parse qilamiz
      for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
        if (typeof body[key] === 'string') {
          try {
            body[key] = JSON.parse(body[key]);
          } catch {
            body[key] = null;
          }
        }
      }

      request.body = body;
    }

    // 🔹 2. Response qaytganda formatlash
    return next.handle().pipe(
      map((data) => {
        // Agar ma'lumot message bo‘lsa, JSON fieldlarni parse qilamiz
        if (data && typeof data === 'object') {
          for (const key of ['files', 'images', 'videos', 'docs', 'stickers']) {
            if (typeof data[key] === 'string') {
              try {
                data[key] = JSON.parse(data[key]);
              } catch {
                // Agar JSON emas bo‘lsa, o‘z holicha qoldiramiz
              }
            }
          }
        }
        return data;
      }),
    );
  }
}
