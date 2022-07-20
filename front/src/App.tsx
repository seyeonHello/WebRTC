import React, {useState, useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'react-bootstrap';
import io from "socket.io-client";
import './App.css';
const socket=io('http://localhost:8080');
const pc_config={
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        }
    ]
}
function App() {
  const [pin, setPin]=useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  let pc: RTCPeerConnection;
  let myStream :MediaStream;
  async function initCall(){
      await getMedia();
      makeConnection();
  }
  async function onSubmitPin(){
      await initCall();
      socket.emit("join_room",pin);
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
      pc.onicecandidate=function(event){
          if(event.candidate){
              socket.emit("ice",event.candidate,pin);
          }
      }
      pc.ontrack=function(event){
          if(remoteVideoRef.current){
              remoteVideoRef.current.srcObject=event.streams[0];
          }
      }
      myStream.getTracks().forEach((track)=>pc.addTrack(track,myStream));
  }
  socket.on('welcome',async()=>{
      console.log("sent the offer.");
      if(pc){
          const offer=await pc.createOffer();
          pc.setLocalDescription(offer);
          socket.emit("offer",offer,pin);
      }
  });
  socket.on('offer',async (offer:RTCSessionDescription)=>{
      console.log("received the offer");
      if(pc){
          pc.setRemoteDescription(offer);
          const answer=await pc.createAnswer();
          pc.setLocalDescription(answer);
          socket.emit("answer",answer,pin);
      }
  });
  socket.on('answer',async (answer:RTCSessionDescription)=>{
      console.log("received the answer");
      if(pc) pc.setRemoteDescription(answer);
  });
  socket.on("ice",async(ice:RTCIceCandidateInit)=>{
      console.log("received candidate");
      if(pc) pc.addIceCandidate(ice);
  })
  return (
    <div className="App">
        <div style={{margin:10}}>
            <input type="text" style={{marginRight:10}} value={pin} onChange={(e)=>setPin(e.target.value)}/>
            <Button onClick={onSubmitPin} variant="warning">submit</Button>
        </div>
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
            <video
                id="remotevideo"
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

export default App;
