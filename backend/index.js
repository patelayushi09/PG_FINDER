const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const port = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Connect to MongoDB
async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000 // Timeout after 10 seconds
    });
}
main().then(() => console.log(" MongoDB connected successfully!"))
     .catch(err => console.log(" MongoDB Connection Error:", err));

//  Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", //  Update to match frontend
        methods: ["GET", "POST"],
    },
});

//  Handle Socket.io Connections
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(` New client connected: ${socket.id}`);

    // Add new user to online list
    socket.on("addNewUser", ({ userId, userType }) => {
        onlineUsers = onlineUsers.filter(user => user.userId !== userId); // Remove old entry
        onlineUsers.push({ userId, userType, socketId: socket.id });

        console.log(" Online users:", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers); // Broadcast updated users
    });

    //  Handle message sending
    socket.on("sendMessage", (message) => {
        console.log(" New message received:", message);
        
        const recipient = onlineUsers.find(user => user.userId === message.receiverId);
        if (recipient) {
            io.to(recipient.socketId).emit("getMessage", message);
            io.to(recipient.socketId).emit("getNotification", {
                senderId: message.senderId,
                senderType: message.senderType,
                receiverId: message.receiverId,
                propertyId: message.propertyId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    //  Handle user disconnect
    socket.on("disconnect", () => {
        console.log(` User disconnected: ${socket.id}`);
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

// Define API Routes
app.get("/", (req, res) => {
    res.send("PG_FINDER server is running...");
});

//  Import & use routes
app.use("/admin", require("./src/routes/adminRoutes"));
app.use("/landlord", require("./src/routes/landlordRoutes"));
app.use("/tenant", require("./src/routes/tenantRoutes"));
app.use("/state", require("./src/routes/stateRoutes"));
app.use("/city", require("./src/routes/cityRoutes"));
app.use("/area", require("./src/routes/areaRoutes"));
app.use("/message", require("./src/routes/messageRoutes"));

// Start the merged Express + Socket.IO server
server.listen(port, () => {
    console.log(` PG_FINDER running on port ${port}`);
});
