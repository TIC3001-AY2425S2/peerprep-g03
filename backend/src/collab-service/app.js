import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import Collab from './models/Collab.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const DEFAULT_DATA = ""; //empty string for no data

mongoose.connect("mongodb://root:example@mongo:27017/peerPrepDB?authSource=admin")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})



io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("get-collab", async collabId => {
        
        const collab = await findOrCreateCollabData(collabId);
        socket.join(collabId);
        socket.emit("load-collab", collab.data);

        socket.on("send-changes", value => {
            socket.broadcast.to(collabId).emit("receive-changes", value)
        })

        socket.on("save-data", async saveData =>  {
            const updatedCollab = await Collab.findByIdAndUpdate(collabId, {data: saveData}, { new: true });
        })
    })
    
    socket.on("disconnect", () => {
        console.log("A user disconencted", socket.id);
    })
})

async function findOrCreateCollabData(id) {
    if(id == null) return;
    const collabData = await Collab.findById(id);
    if(collabData) return  collabData;
    return await Collab.create({ _id: id, data: DEFAULT_DATA});
}

app.use(cors());
app.use(express.json());

//app.use('/api/collab', collabRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export {io, app, server};
