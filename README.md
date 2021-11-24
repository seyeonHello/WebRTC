# Noom

Zoom Clone using WebRTC and Websockets.

#### 👉🏻adapter: 다른 서버들 사이에 실시간 어플리케이션을 동기화하는 것, 서버간의 통신
- adapter는 누가 연결되었는지, 현재 어플리케이션에 room이 얼마나 있는지 알려줌
- adapter에서 socketID를 찾을 수 없다면, public room을 찾은 것. 있다면, private room을 찾은 것.

#### 👉🏻signal server
- 브라우저간의 configuration, setting, ip address, 방화벽, 라우터 등의 정보 전달을 통해 P2P 연결을 도움 
- 미디어와 오디오 스트림은 서버를 거치지 않고, P2P통신으로 진행


#### 👉🏻ICE : internet connectivity Establishment
- IceCandidate는 webRTC에 필요한 프로토콜들을 의미

#### 👉🏻Sender
- peer의 media stream track을 컨트롤함

#### 🏻외부망에서 localhost 접속하기
- lt --port 3000

#### 🏻참고사이트
- websocket : https://velog.io/@wldus9503/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-Network3.-WebSocket-%EC%9B%B9-%EC%86%8C%EC%BC%93%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C
- turn : https://devji.tistory.com/entry/TURN-Traversal-Using-Relays-around-NAT
