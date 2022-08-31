import React, {useState, useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import io from "socket.io-client";

const socket=io('http://localhost:8080');
const pc_config={
    iceServers: [
        {
            urls: "stun:stun.stunprotocol.org",
        }
    ]
}
function SFU_host() {
  const [pin, setPin]=useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  let pc: RTCPeerConnection;
  let myStream :MediaStream;
  async function initCall(){
      await getMedia();
      makeConnection();
  }
  async function getMedia(){
      try{
          myStream=await navigator.mediaDevices.getUserMedia({
              audio:true,
              video:{facingMode:"user"}
          });
          if(localVideoRef.current) localVideoRef.current.srcObject=myStream;
      }catch(e){
          console.log(e);
      }
  }
  function makeConnection(){
      pc=new RTCPeerConnection(pc_config);
      myStream.getTracks().forEach(track=>pc.addTrack(track,myStream));
      socket.emit("join_room");
      //pc.onnegotiationneeded=()=>handleNegotiationNeededEvent();
  }
  socket.on('welcome',async ()=>{
    if(pc){
        const offer=await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('broadcast',pc.localDescription);  
    }
  })
//   async function handleNegotiationNeededEvent(){
//     if(pc){
//         const offer=await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         socket.emit('broadcast',pc.localDescription);  
//     }
//    }
    socket.on('answer_host',async (sdp:RTCSessionDescription)=>{
        const desc = new RTCSessionDescription(sdp);
        console.log(desc)
        await pc.setRemoteDescription(desc);
      })  
  useEffect(() => {
    initCall();
  });
  return (
    <div className="App">
        <div>
            <video
                style={{
                    width: 240,
                    height: 240,
                    margin: 5,
                    backgroundColor: "black",
                }}
                muted
                ref={localVideoRef}
                autoPlay
            />
        </div>
    </div>
  );
}

export default SFU_host;
