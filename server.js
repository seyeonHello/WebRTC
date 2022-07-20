let express = require("express");
let http = require("http");
let app = express();
let cors = require("cors");
let server = http.createServer(app);
let socketio = require("socket.io");
let wss = socketio.listen(server);
app.use(cors());

wss.on("connection",(socket)=>{
    socket.on("join_room",(roomName)=>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer",(offer,roomName)=>{
        socket.to(roomName).emit("offer",offer);
    });
    socket.on("answer",(answer,roomName)=>{
        socket.to(roomName).emit("answer",answer);
    });
    socket.on("ice",(ice,roomName)=>{
        socket.to(roomName).emit("ice",ice);
    })
});

const handleListen = () => console.log(`Listening on http://localhost:8080`);
server.listen(8080, handleListen);
