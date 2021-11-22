import http from "http";
import { Server } from "socket.io";
import express from "express";
import {instrument} from "@socket.io/admin-ui";
import { WebSocketServer } from "ws";

const app = express();
//babel은 작성한 코드를 nodejs 코드로 컴파일 해줌
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //유저가 볼수 있는 코드
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss= new Server(server,{
    cors:{
        origin:["https://admin.socket.io"],
        credential: true,
    },
});
instrument(wss,{
    auth: false
});
function publicRooms() {
    const {
        sockets:{
            adapter:{sids,rooms},
        },
    }=wss;
    const publicRooms=[];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
   return wss.sockets.adapter.rooms.get(roomName)?.size;
}
wss.on("connection",(socket)=>{
    console.log(wss.sockets.adapter);
    socket["nickname"]="Anon";
    socket.onAny((event)=>{
        console.log(`Socket event: ${event}`);
    })
    socket.on("enter_room",(roomName,done)=>{
        //기존에 pirvate한 room이 있었음(socket.id)
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wss.sockets.emit("room_change",publicRooms()); //연결된 모든 소켓에게 메시지 전송
    });
    socket.on("disconnecting",()=>{ //disconnecting event는 socket이 방을 떠나기 바로 직전에 발생.
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye",socket.nickname,countRoom(room)-1);
        });
    });
    socket.on("disconnect",()=>{
        wss.sockets.emit("room_change",publicRooms());
    });
    socket.on("new_message",(msg,room,done)=>{
        socket.to(room).emit("new_message",`${socket.nickname}:${msg}`);
        done();
    });
    socket.on("nickname",(nickname)=>(socket["nickname"]=nickname));
});
/*
const wss = new WebSocket.Server({ server }); //같은 서버에 http, ws 동시에 사용(same port), http는 view,redirect~ 이런거땜에 필요
const sockets=[];

wss.on("connection", (socket) => { //connection이 생기면 여기 socket에 누가 연결했는지 알 수 있음
    sockets.push(socket);
    socket["nickname"]="Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (msg) => {
        const message=JSON.parse(msg);
        switch (message.type){
            case "new_message":
                sockets.forEach((aSocket)=>aSocket.send(`${socket.nickname}: ${message.payload.toString('utf8')}`));
                break
            case "nickname":
                socket["nickname"]=message.payload.toString('utf8')

        }
    });
});
*/
server.listen(3000, handleListen);