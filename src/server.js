import express from "express";
import http from "http";
import WebSocket from "ws";
import {handle} from "express/lib/router";
const app=express();
app.set("view engine","pug");
app.set("views",__dirname+"/views");
app.use("/public",express.static(__dirname+"/public")); //유저가 볼수 있는 코드
app.get("/",(req,res)=> res.render("home"));

//babel은 작성한 코드를 nodejs 코드로 컴파일 해줌
const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server= http.createServer(app);
const wss=new WebSocket.Server({server}); //같은 서버에 http, ws 동시에 사용(same port), http는 view,redirect~ 이런거땜에 필요

server.listen(3000,handleListen);