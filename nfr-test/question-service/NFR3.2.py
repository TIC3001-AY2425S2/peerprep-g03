#NFR3.2 PeerPrep shall maintain average response time under 10 seconds for 10,000 questions related requests.
import asyncio
import time
import random
from aiohttp import ClientSession
from urllib.parse import quote

BASE_URL = "http://localhost:4000/api/questions"
CONCURRENCY = 100
TOTAL_REQUESTS = 10000
SAMPLE_TITLES = ["Reverse a String", "Linked List Cycle Detection", "Two Sum"]

async def populate_questions():
    current_count = await get_current_count()
    if current_count >= 10000:
        return

    print(f"Populating {10000 - current_count} questions")

    async with ClientSession() as session:
        tasks = []
        for i in range(current_count, 10000):
            question = {
                "title": f"Q{i}_PerfTest",
                "description": f"Performance test question {i}",
                "categories": random.sample(["Algorithms", "Data Structures"], k=1),
                "complexity": random.choice(["Easy", "Medium", "Hard"])
            }
            tasks.append(session.post(BASE_URL, json=question))

        batch_size = 500
        for i in range(0, len(tasks), batch_size):
            responses = await asyncio.gather(*tasks[i:i+batch_size], return_exceptions=True)
            success = sum(1 for r in responses if isinstance(r, dict) and r.status == 200)
            print(f"Created {success}/{batch_size} questions in batch {i//batch_size + 1}")

async def get_current_count():
    async with ClientSession() as session:
        try:
            async with session.get(BASE_URL) as response:
                data = await response.json()
                return len(data.get('question', []))
        except:
            return 0

async def run_load_test():
    endpoints = [
        BASE_URL,
        f"{BASE_URL}/random?complexity=Easy",
        f"{BASE_URL}/{quote(random.choice(SAMPLE_TITLES))}"
    ]

    timings = []
    start_time = time.monotonic()

    async with ClientSession() as session:
        semaphore = asyncio.Semaphore(CONCURRENCY)

        async def make_request():
            async with semaphore:
                url = random.choice(endpoints)
                start = time.monotonic()
                try:
                    async with session.get(url) as response:
                        await response.read()
                        if response.status != 200:
                            return None
                except Exception as e:
                    return None
                return time.monotonic() - start

        tasks = [make_request() for _ in range(TOTAL_REQUESTS)]
        for future in asyncio.as_completed(tasks):
            result = await future
            if result is not None:
                timings.append(result)
            if len(timings) % 1000 == 0:
                print(f"Processed {len(timings)}/{TOTAL_REQUESTS} requests")

    total_time = time.monotonic() - start_time
    avg_time = sum(timings) / len(timings) if timings else 0
    req_per_sec = len(timings) / total_time if total_time > 0 else 0

    print(f"\nResults:")
    print(f"Successful requests: {len(timings)}/{TOTAL_REQUESTS}")
    print(f"Average response time: {avg_time:.2f}s")
    print(f"Requests/sec: {req_per_sec:.2f}")
    print(f"Total test duration: {total_time:.2f}s")

    return avg_time

async def main():
    print("Starting NFR3.2 Validation")
    await populate_questions()
    avg_time = await run_load_test()
    if avg_time <= 10:
        print("Test passed NFR3.2 requirements!")
    else:
        print("Test failed to meet requirements")

if __name__ == "__main__":
    asyncio.run(main())
