import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

io.on("connection", (socket) => {
    console.log("A user connected", socket.id)

    socket.on("get-collab", collabId => {
        const data = "";
        socket.join(collabId)
        socket.emit("load-collab", data)

        socket.on("send-changes", value => {
            socket.broadcast.to(collabId).emit("receive-changes", value)
        })
    })
    
    socket.on("disconnect", () => {
        console.log("A user disconencted", socket.id);
    })
})

app.use(cors());
app.use(express.json());

//app.use('/api/collab', collabRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export {io, app, server};
