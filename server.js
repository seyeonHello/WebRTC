let express = require("express");
let http = require("http");
let app = express();
let cors = require("cors");
let server = http.createServer(app);
let socketio = require("socket.io");
let wss = socketio.listen(server);
const webrtc=require("wrtc");
let senderStream;
app.use(cors());

wss.on("connection",(socket)=>{
    // method 1 - p2p
    /*
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
    */
   // method 2 - one to many(sfu)
   socket.on("join_room",()=>{
        socket.emit("welcome");
   });
   socket.on("broadcast",async (sdp)=>{
        const peer=new webrtc.RTCPeerConnection({
            iceServers:[{
                urls:"stun:stun.stunprotocol.org"
            }]
        });
        peer.ontrack=(e)=>handleTrackEvent(e,peer);
        const desc=new webrtc.RTCSessionDescription(sdp);
        await peer.setRemoteDescription(desc);
        const answer=await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer_host",peer.localDescription);
    });
    socket.on("consumer",async (sdp)=>{
        const peer=new webrtc.RTCPeerConnection({
            iceServers:[{
                urls:"stun:stun.stunprotocol.org"
            }]
        });
        const desc=new webrtc.RTCSessionDescription(sdp);
        await peer.setRemoteDescription(desc);
        senderStream.getTracks().forEach(track=>peer.addTrack(track,senderStream));
        const answer=await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer_viewer",peer.localDescription);
    });
    function handleTrackEvent(e,peer){
        senderStream=e.streams[0];
    }
});

const handleListen = () => console.log(`Listening on http://localhost:8080`);
server.listen(8080, handleListen);
