## Getting Started With Match Service
Start by docker compose
```
docker compose up -d --build
```
Open terminal and connect to websocket
```
 websocat -t ws://0.0.0.0:8080/match
```
Send message and receive response message
```
{"type":"START_MATCH","userId":"user_1","data":{"topic":"Algorithms","difficulty":"Easy"}}
{"type":"START_MATCH","userId":"user_1","data":{"topic":"Algorithms","difficulty":"Hard"}}
{"type":"START_MATCH","userId":"user_1","data":{"topic":"Array","difficulty":"Easy"}}
```

Sample response
```
{"type":"MATCH_FOUND","match":{"userId":"user_2","topic":"Algorithms","difficulty":"Easy","sessionId":"e2d973da-966d-40a9-823a-1470eae99ff9","questionId":"67c42613224f2a6077584a24"}}
```
Open another terminal and connect to websocket
```
 websocat -t ws://0.0.0.0:8080/match
```
Send another message and receive response message
```
{"type":"START_MATCH","userId":"user_2","data":{"topic":"Algorithms","difficulty":"Easy"}}
```
Sample response
```
{"type":"MATCH_FOUND","match":{"userId":"user_1","topic":"Algorithms","difficulty":"Easy","sessionId":"49c3f08d-694e-4768-8dd8-1d3e60cfeb50","questionId":"67c42613224f2a6077584a24"}}
```
## Match Service Feature support 
1. Support exact topic and difficulty match
2. Support Topic match 
3. Support Difficulty match
4. Support time out 
