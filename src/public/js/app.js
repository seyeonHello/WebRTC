const socket=io(); //알아서 찾아서 연결해줌

const welcome=document.getElementById("welcome")
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden=true;
let roomName;

function showRoom() {
    welcome.hidden=true;
    room.hidden=false;
    const h3=room.querySelector("h3");
    h3.innerText=`Room ${roomName}`;
}
function handleRoomSubmit(event){
    event.preventDefault();
    const input=form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom); // object도 보낼 수 있음, argument로 함수도 가능(backend에 전달), function은 마지막에?
    roomName=input.value;
    input.value=""
}

form.addEventListener("submit",handleRoomSubmit);