import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SessionsService {

  private server: Server;
  public userSessions: Record<string, Record<string, string[]>> = {};

  setServer(server: Server) {
    this.server = server;
  }

  addConnection(userId: string, deviceId: string, socket: Socket) {
    this.sendToUser(userId, { userId, isOnline: true }, "online")
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = {};
    }
    if (!this.userSessions[userId][deviceId]) {
      this.userSessions[userId][deviceId] = [];
    }
    this.userSessions[userId][deviceId].push(socket.id);
    console.log(this.userSessions)

  }

  chekIsOnlie(userId: string) {
    return this.userSessions[userId] ? true : false
  }

  removeConnection(userId: string, deviceId: string, socketId: string) {
    console.log("SessionsService  removeconnection")
    this.sendToUser(userId, { userId, isOnline: false }, "online")

    if (this.userSessions[userId]?.[deviceId]) {

      this.userSessions[userId][deviceId] =
        this.userSessions[userId][deviceId].filter(id => id !== socketId);

      if (this.userSessions[userId][deviceId].length === 0) {
        delete this.userSessions[userId][deviceId];
      }

      if (Object.keys(this.userSessions[userId]).length === 0) {
        delete this.userSessions[userId];
      }
    }
  }

  sendToUser(userId: string, message: any, emiter?: string) {
    console.log(message, emiter)
    const devices = this.userSessions[userId] || {};
    Object.keys(this.userSessions).forEach((userId) => {
      Object.values(this.userSessions[userId]).forEach(socketIds => {
        socketIds.forEach(id => {
          this.server.to(id).emit(emiter || "typing", emiter ? message : userId);
        });
      });
    })
  }

  sendToDevice(userId: string, deviceId: string, message: any) {
    const sockets = this.userSessions[userId]?.[deviceId] || [];
    sockets.forEach(id => {
      this.server.to(id).emit('message', message);
    });
  }

  onTypingByUserIdUser(userId: string, data: { userId: string, chatId: string }) {
    Object.entries(this.userSessions).forEach(([ownerId, devices]) => {
      if (ownerId === userId) return
      for (let [device, socketIds] of Object.entries(devices)) {
        socketIds.forEach(id => {
          this.server.to(id).emit("typing", data)

        })
      }
    })
  }
}
