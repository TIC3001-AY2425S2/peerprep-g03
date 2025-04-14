import asyncio
import time
import json
from websockets import connect
from collections import defaultdict

WS_URL = "ws://localhost:8080/match"
CONCURRENCY = 80
TOTAL_USERS = 10000
TOPIC = "Algorithms"
DIFFICULTY = "Easy"
REQUEST_TIMEOUT = 25
RETRY_LIMIT = 3

class WebSocketClient:
    def __init__(self, user_id):
        self.user_id = user_id
        self.websocket = None
        self.response_time = None
        self.matched = False
        self.connection_time = None

async def maintain_connection(client):
    try:
        while True:
            await client.websocket.ping()
            await asyncio.sleep(5)
    except Exception:
        pass

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

        client.connection_time = time.monotonic()
        await client.websocket.send(message)

        while True:
            try:
                response = await asyncio.wait_for(
                    client.websocket.recv(),
                    timeout=REQUEST_TIMEOUT
                )
                data = json.loads(response)
                if data.get("type") == "MATCH_FOUND":
                    client.response_time = time.monotonic() - client.connection_time
                    client.matched = True
                    return
                elif data.get("type") == "ERROR":
                    return
            except (asyncio.TimeoutError, ConnectionResetError):
                print(f"Timeout for {client.user_id}")
                return
    except Exception as e:
        print(f"Error for {client.user_id}: {str(e)}")
    finally:
        try:
            await client.websocket.close()
        except Exception:
            pass

async def simulate_user(client):
    for attempt in range(RETRY_LIMIT):
        try:
            async with connect(
                WS_URL,
                ping_interval=10,
                ping_timeout=5,
                close_timeout=1
            ) as ws:
                client.websocket = ws
                maintenance_task = asyncio.create_task(maintain_connection(client))
                await send_message(client)
                maintenance_task.cancel()
                return client
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {client.user_id}: {str(e)}")
            await asyncio.sleep(0.5 * (attempt + 1))
    return client

async def run_load_test():
    users = [WebSocketClient(f"user_{i}") for i in range(TOTAL_USERS)]

    start_time = time.monotonic()
    semaphore = asyncio.Semaphore(CONCURRENCY)

    async def worker(user):
        async with semaphore:
            return await simulate_user(user)

    batch_size = 500
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
