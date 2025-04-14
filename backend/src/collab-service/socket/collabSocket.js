import { getSession,getSessionData, addUserToSession, setSessionData, addSessionToSet} from '../cache/redisCache.js';
import { createNewOrJoinCollabSession, saveSessionData } from '../controller/collab-controller.js';

export default function (socket, io) {
    socket.on("get-collab", async (collabId, userId) => {
        const checkSessionData = await getSessionData(collabId);
        if(!checkSessionData){
            console.log(`no reddis cache found for ${collabId} , so adding it to cache`);
            const collabSession = await createNewOrJoinCollabSession(collabId);
            await setSessionData(collabId, collabSession.data);
            await addSessionToSet(collabId);
        }

        await addUserToSession(collabId, userId, socket.id);
        
        socket.join(collabId);
        const sessionData = await getSessionData(collabId);
        socket.emit("load-collab", sessionData);

        socket.on("send-changes", async (newData) => {
            await setSessionData(collabId, newData);
            socket.broadcast.to(collabId).emit("receive-changes", newData);
        })

        socket.on("save-data", async (newData) =>  {
            await setSessionData(collabId, newData);
        })
    })
}