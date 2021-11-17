import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();
//babel은 작성한 코드를 nodejs 코드로 컴파일 해줌
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); //유저가 볼수 있는 코드
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss= SocketIO(server);

wss.on("connection",(socket)=>{
    socket.onAny((event)=>{
        console.log(`Socket event: ${event}`);
    })
    socket.on("enter_room",(roomName,done)=>{
        //기존에 pirvate한 room이 있었음(socket.id)
        socket.join(roomName);
        done();
    });
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