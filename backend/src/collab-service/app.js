import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './config/db.js';
import { addUserToSession, getSession, removeUserBySocketId, getCollabIdBySocketId, getSessionData, 
    getAllActiveSessionIds, getCollabUsers, delSessionData, removeSessionFromSet } from './cache/redisCache.js';
import { saveSessionData } from './controller/collab-controller.js';
import collabRoutes from './routes/collaboration.js';
import collabSocket from './socket/collabSocket.js';
import notificationSocket from './socket/notificationSocket.js';


dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
    
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }   
})

app.use(cors());
app.use(express.json());
app.use('/collab', collabRoutes);

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("user-connected", async ({userId, collabId}) => {
        console.log(`User connected : ${userId} to ${collabId}`);
        await addUserToSession(collabId, userId, socket.id);
    });

    //initialize
    collabSocket(socket, io);
    notificationSocket(socket, io);
    
    socket.on("disconnect", async () => {
        console.log("A user disconnected", socket.id);
        await removeUserBySocketId(socket.id);
        const collabId = await getCollabIdBySocketId(socket.id);
        if (collabId) {
            const sessionData = await getSessionData(collabId);   
            if (sessionData) {
              try {
                // Persist the session's data to the database before cleaning up.
                await saveSessionData(collabId, sessionData);
                console.log(`Session ${collabId} saved on disconnect`);
              } catch (error) {
                console.error(`Failed to save session ${collabId} on disconnect`, error);
              }
            }
        }
        await removeUserBySocketId(socket.id);

    })
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//periodically save local cache to db
setInterval(async () => {
    try{
        const activeSessionIds = await getAllActiveSessionIds();
        for (const collabId of activeSessionIds) {
            const users = await getCollabUsers(collabId);
            if (Object.keys(users).length > 0) {
                // active users exist, save data to db
                const session = await getSession(collabId);
                if (session) {
                  await saveSessionData(collabId, session.data);
                  console.log(`Session ${collabId} saved at ${new Date().toISOString()}`);
                }
              } else {
                // no active users, remove collabid from activeSession and remove collabdata from redis
                await removeSessionFromSet(collabId); 
                await delSessionData(collabId);
                console.log(`Session ${collabId} removed due to inactivity at ${new Date().toISOString()}`);
              }
        }

    }catch (err){
        console.error("Error during periodic cleanup/save", err);
    }
}, 5000);

export {io, app, server};
