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
function SFU_viewer() {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  let pc: RTCPeerConnection;
  async function initCall(){
      makeConnection();
  }
  function makeConnection(){
      pc=new RTCPeerConnection(pc_config);
      pc.ontrack=function(event){
        if(remoteVideoRef.current){
            console.log(event)
            remoteVideoRef.current.srcObject=event.streams[0];
        }
    }
    pc.onnegotiationneeded=()=>handleNegotiationNeededEvent();
    pc.addTransceiver("video", { direction: "recvonly" })
  }
  async function handleNegotiationNeededEvent(){
    const offer=await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log(offer);
    socket.emit('consumer',pc.localDescription);
    socket.on('answer_viewer',(sdp:RTCSessionDescription)=>{
      console.log(sdp)
      const desc = new RTCSessionDescription(sdp);
      pc.setRemoteDescription(desc);
    })
  }
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
                ref={remoteVideoRef}
                autoPlay
            />
        </div>
    </div>
  );
}

export default SFU_viewer;
