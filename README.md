# Noom

Zoom Clone using WebRTC and Websockets.

#### 👉🏻adapter: 다른 서버들 사이에 실시간 어플리케이션을 동기화하는 것, 서버간의 통신
- adapter는 누가 연결되었는지, 현재 어플리케이션에 room이 얼마나 있는지 알려줌
- adapter에서 socketID를 찾을 수 없다면, public room을 찾은 것. 있다면, private room을 찾은 것.

#### 👉🏻signal server
- 브라우저간의 configuration정보를 통해서 P2P 연결을 도움

#### 👉🏻참고사이트
- websocket : https://velog.io/@wldus9503/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-Network3.-WebSocket-%EC%9B%B9-%EC%86%8C%EC%BC%93%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C
- turn : https://devji.tistory.com/entry/TURN-Traversal-Using-Relays-around-NAT
