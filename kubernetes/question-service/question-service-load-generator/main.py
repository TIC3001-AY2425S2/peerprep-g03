import asyncio

import aiohttp

# Configuration
URL = "http://question-service:4000/api/questions"
CONCURRENT_REQUESTS = 50
DELAY_BETWEEN_BATCHES = 0.1


async def fetch(session, i):
    try:
        async with session.get(URL) as response:
            await response.text()
            print(f"[{i}] Status: {response.status}")
    except Exception as e:
        print(f"[{i}] Error: {e}")


async def generate_load():
    i = 0
    # Force aiohttp to close TCP connection after each request (no keep-alive)
    connector = aiohttp.TCPConnector(force_close=True)

    async with aiohttp.ClientSession(connector=connector) as session:
        while True:
            tasks = [fetch(session, i + j) for j in range(CONCURRENT_REQUESTS)]
            await asyncio.gather(*tasks)
            i += CONCURRENT_REQUESTS
            await asyncio.sleep(DELAY_BETWEEN_BATCHES)


if __name__ == "__main__":
    print("🚀 Starting load generator...")
    try:
        asyncio.run(generate_load())
    except KeyboardInterrupt:
        print("🛑 Load generation stopped by user.")
