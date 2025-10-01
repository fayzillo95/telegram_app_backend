import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SessionsService {
  private server: Server;
  private userSessions: Record<string, Record<string, string[]>> = {};

  setServer(server: Server) {
    this.server = server;
  }

  addConnection(userId: string, deviceId: string, socket: Socket) {
    if (!this.userSessions[userId]) {
      this.userSessions[userId] = {};
    }
    if (!this.userSessions[userId][deviceId]) {
      this.userSessions[userId][deviceId] = [];
    }
    this.userSessions[userId][deviceId].push(socket.id);
  }

  removeConnection(userId: string, deviceId: string, socketId: string) {
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

  sendToUser(userId: string, message: any, emiter : string) {
    const devices = this.userSessions[userId] || {};
    Object.values(devices).forEach(socketIds => {
      socketIds.forEach(id => {
        this.server.to(id).emit('message', message);
      });
    });
  }

  sendToDevice(userId: string, deviceId: string, message: any) {
    const sockets = this.userSessions[userId]?.[deviceId] || [];
    sockets.forEach(id => {
      this.server.to(id).emit('message', message);
    });
  }
}
