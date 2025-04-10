import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './db.js';
import { createNewOrJoinCollabSession, saveSessionData } from './controller/collab-controller.js';
import collabRoutes from './routes/collaboration.js';


dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
    
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }   
})

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    socket.on("get-collab", async collabId => {
        
        const collab = await createNewOrJoinCollabSession(collabId);
        socket.join(collabId);
        socket.emit("load-collab", collab.data);

        socket.on("send-changes", value => {
            socket.broadcast.to(collabId).emit("receive-changes", value)
        })

        socket.on("send-end-session", async sessionId => {
            socket.broadcast.to(collabId).emit("receive-end-session", sessionId)
        })

        socket.on("save-data", async saveData =>  {
            const updatedCollab = saveSessionData(collabId, saveData);
        })

        
    })
    
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
    })
})

app.use(cors());
app.use(express.json());
app.use('/collab', collabRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export {io, app, server};
