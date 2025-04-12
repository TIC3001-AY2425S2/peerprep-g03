// NFR 4.2
import {io} from 'socket.io-client';
//import mongoose from 'mongoose';

// Configuration
const COLLAB_URL = "http://localhost:4002";
const NUM_SESSIONS = 300;
const USERS_PER_SESSION = 2;
const TOTAL_CLIENTS = NUM_SESSIONS * USERS_PER_SESSION;
const TIMEOUT = 30000;
const clients = [];
const latencies = [];
//const MONGO_URI = "mongodb://root:example@localhost:27019/peerPrepDB?authSource=admin";
let max_latency = 0;

//start of db setup to delete db record later
//db schema
// const collabSchema = new mongoose.Schema({
//   _id : {
//       type: String,
//   },
//   data: {
//       type: String,
//   },
//   questionId : {
//       type: String,
//   }
// });

// const Collab = mongoose.model('Collab', collabSchema);

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   }
// };

// const deleteAllCollabData = async () => {
//   // Connect to MongoDB using the adjusted connection string for localhost.
//   await connectDB();

//   try {
//     // Delete all documents in the Collab collection.
//     const result = await Collab.deleteMany({});
//     console.log('All Collab data has been deleted:', result);
//   } catch (error) {
//     console.error('Error deleting Collab data:', error);
//   } finally {
//     // It's good practice to close the connection once the operations are complete.
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// };
//end of db
//start of test

const registerLatency = (startTime, userId, collabId) => {
  const latency = Date.now() - startTime;
  latencies.push(latency);
  if(latency > max_latency){
    max_latency = latency;
  }
  console.log(`Latency for session ${collabId} ( client ${userId}): ${latency}ms`);
}

// Helper to simulate a client connecting to a specific session.
const connectClient = (collabId, userId) => {
  const socket = io(COLLAB_URL);
  socket.on("connect", () => {
    console.log(`Client ${userId} connected for session ${collabId} with socket ${socket.id}`);
    socket.emit("get-collab", collabId, userId);

    // Simulate code change after a delay.
    setTimeout(() => {
      const startTime = Date.now();
      socket.emit("send-changes", "This is a test for NFR 4.2");
      socket.on("receive-changes", () => {
        registerLatency(startTime, userId, collabId);
      });
    }, 1000);
  });

  // Listen to error events
  socket.on("error", (err) => {
    console.error(`Error on client ${userId}:`, err);
  });

  return socket;
};

// Launch clients: 2 users per session.
for (let i = 1; i <= NUM_SESSIONS; i++) {
  for (let j = 1; j <= USERS_PER_SESSION; j++) {
    // Create unique user id per client.
    const userId = `user-session${i}-${j}`;
    const socket = connectClient(`session-${i}`, userId);
    clients.push(socket);
  }
}

// You can optionally end the test after some time.
setTimeout(async () => {
  clients.forEach((socket) => socket.disconnect());
  console.log("Test complete. Disconnecting all clients...");
  const totalLatency = latencies.reduce((sum, latency) => sum + latency, 0);
  const avgLatency = latencies.length ? totalLatency / latencies.length : 0;
  console.log(`Testing for NFR4.2 , ${NUM_SESSIONS} number of sessions concurrently`);
  console.log(`Average Latency: ${avgLatency.toFixed(2)} ms`);
  console.log(`Max latency: ${max_latency} ms`);

  if(avgLatency < 1000){
    console.log(`\nResult : Test passed NFR4.2 requirements!.\n`);
  } else{
    console.log(`\nResult : Test failed NFR4.2 requirements!.\n`);
  }

  //await deleteAllCollabData();
  process.exit(0);
}, TIMEOUT);