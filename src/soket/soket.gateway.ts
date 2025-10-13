import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SessionsService } from './soket.service';

@WebSocketGateway(15975, {
  cors: {
    origin: true,
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketService: SessionsService) { }

  afterInit(server) {
    this.socketService.setServer(server);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const deviceId = client.handshake.query.deviceId as string;

    this.socketService.addConnection(userId, deviceId, client);

    client.on("typing", (data : {userId: string,chatId: string}) => {
      console.log("typing",data.userId,userId)
      this.socketService.onTypingByUserIdUser(userId ,data);
    });
    client.on("typing_stop", (data :  {userId: string,chatId: string }) => {
      this.socketService.sendToUser(userId, data, "typing_stop");
    });
  }


  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const deviceId = client.handshake.query.deviceId as string;
    this.socketService.removeConnection(userId, deviceId, client.id);
  }
}
