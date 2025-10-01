export interface ResponseJwtType {
  accessToken: string;
  refreshToken: string;
}

export type UserSessionType = Record<string, Record<string, string[]>[]>



// // connect bo‘lganda
// handleConnection(client: Socket) {
//   const userId = client.handshake.query.userId as string
//   const deviceId = client.handshake.query.deviceId as string

//   if (!userSessions[userId]) {
//     userSessions[userId] = {}
//   }
//   if (!userSessions[userId][deviceId]) {
//     userSessions[userId][deviceId] = []
//   }

//   userSessions[userId][deviceId].push(client.id)
// }

// // disconnect bo‘lganda
// handleDisconnect(client: Socket) {
//   const userId = client.handshake.query.userId as string
//   const deviceId = client.handshake.query.deviceId as string

//   userSessions[userId][deviceId] = 
//     userSessions[userId][deviceId].filter(id => id !== client.id)

//   if (userSessions[userId][deviceId].length === 0) {
//     delete userSessions[userId][deviceId]
//   }
// }
