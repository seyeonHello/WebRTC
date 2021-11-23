import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
//babel은 작성한 코드를 nodejs 코드로 컴파일 해줌
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //유저가 볼수 있는 코드
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const server = http.createServer(app);
const wss= new Server(server);

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
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
