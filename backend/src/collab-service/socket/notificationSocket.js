import {getCollabIdBySocketId} from '../cache/redisCache.js';

export default function notificationSocket(socket, io) {
    socket.on("send-end-session", async (sessionInfo) => {
      
      const collabId = await getCollabIdBySocketId(socket.id);
      
      if (collabId) {
        socket.broadcast.to(collabId).emit("receive-end-session", sessionInfo);
        console.log(`Notification: Session ${collabId} ended. Notified room participants.`);
      } else {
        console.log("Notification: Unable to determine collabId for socket", socket.id);
      }
    });
  }