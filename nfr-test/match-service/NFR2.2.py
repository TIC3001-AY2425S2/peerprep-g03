import asyncio
import time
import uuid
import json
from websockets import connect
from collections import defaultdict

WS_URL = "ws://localhost:8080/match"
CONCURRENCY = 200
TOTAL_USERS = 10000
TOPIC = "Algorithms"
DIFFICULTY = "Easy"

class WebSocketClient:
    def __init__(self, user_id):
        self.user_id = user_id
        self.websocket = None
        self.response_time = None
        self.matched = False

async def send_message(client):
    try:
        message = json.dumps({
            "type": "START_MATCH",
            "userId": client.user_id,
            "data": {
                "topic": TOPIC,
                "difficulty": DIFFICULTY
            }
        })

        start_time = time.monotonic()
        await client.websocket.send(message)

        while True:
            response = await client.websocket.recv()
            data = json.loads(response)
            if data.get("type") == "MATCH_FOUND":
                client.response_time = time.monotonic() - start_time
                client.matched = True
                return
            elif data.get("type") == "ERROR":
                return
    except Exception as e:
        print(f"Error for {client.user_id}: {str(e)}")
    finally:
        await client.websocket.close()

async def simulate_user(client):
    try:
        async with connect(WS_URL) as ws:
            client.websocket = ws
            await send_message(client)
    except Exception as e:
        print(f"Connection failed for {client.user_id}: {str(e)}")
    return client

async def run_load_test():
    print("Starting WebSocket load test...")
    users = [WebSocketClient(f"user_{i}") for i in range(TOTAL_USERS)]

    timings = []
    matched_pairs = defaultdict(int)
    start_time = time.monotonic()

    semaphore = asyncio.Semaphore(CONCURRENCY)

    async def worker(user):
        async with semaphore:
            return await simulate_user(user)

    batch_size = 1000
    results = []
    for i in range(0, TOTAL_USERS, batch_size):
        batch = users[i:i+batch_size]
        batch_results = await asyncio.gather(*[worker(u) for u in batch])
        results.extend(batch_results)

        completed = sum(1 for u in results if u.response_time is not None)
        print(f"Processed {completed}/{TOTAL_USERS} users")

    successful = [u for u in results if u.matched]
    avg_time = sum(u.response_time for u in successful) / len(successful) if successful else 0
    total_time = time.monotonic() - start_time

    print(f"\nResults:")
    print(f"Successful matches: {len(successful)}/{TOTAL_USERS}")
    print(f"Average match time: {avg_time:.2f}s")
    print(f"Total test duration: {total_time:.2f}s")
    return avg_time

async def main():
    avg_time = await run_load_test()
    if avg_time <= 10:
        print("\nTest passed NFR2.2 requirements!")
    else:
        print("\nTest failed to meet requirements")

if __name__ == "__main__":
    asyncio.run(main())
