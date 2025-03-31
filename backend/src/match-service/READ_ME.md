## Getting Started With Match Service
Start by docker compose
```
docker compose up -d --build
```
Open terminal and connect to websocket
```
 websocat -t ws://0.0.0.0:8080/match
```
Send message
```
{"type":"MATCH_FOUND","match":{"userId":"user_1","topic":"Algorithms","difficulty":"Hard"}}
```
Open another terminal and connect to websocket
```
 websocat -t ws://0.0.0.0:8080/match
```
Send another message
```
{"type":"MATCH_FOUND","match":{"userId":"user_2","topic":"Algorithms","difficulty":"Hard"}}
```
## Match Service Feature support 
1. Support exact topic and difficulty match
2. Support Topic match 
3. Support Difficulty match
4. Support time out 
