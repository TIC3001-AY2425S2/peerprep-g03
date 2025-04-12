#NFR3.1 PeerPrep shall store at least 100 questions and maintain query responses for search operations under 3 seconds for 90% of the requests.
import asyncio
import time
import random
from aiohttp import ClientSession
from urllib.parse import quote

BASE_URL = "http://localhost:4000/api/questions"
SAMPLE_TITLE = "Two Sum"
SAMPLE_COMPLEXITY = "Easy"
SAMPLE_CATEGORY = "Algorithms"

async def populate_questions():
    #Ensure at least 100 questions is available
    async with ClientSession() as session:
        try:
            async with session.get(BASE_URL) as response:
                data = await response.json()
                current_count = len(data.get('question', []))
        except Exception as e:
            print(f"Failed to connect to server: {str(e)}")
            return False

        if current_count >= 100:
            print(f"Already have {current_count} questions")
            return True

        print(f"Populating {100 - current_count} questions")
        tasks = []
        for i in range(current_count, 100):
            question = {
                "title": f"Sample Question {i}",
                "description": f"Description {i}",
                "categories": ["Algorithms"],
                "complexity": "Easy"
            }
            tasks.append(session.post(BASE_URL, json=question))

        batch_size = 20
        for i in range(0, len(tasks), batch_size):
            batch = tasks[i:i+batch_size]
            responses = await asyncio.gather(*batch, return_exceptions=True)
            success = sum(1 for r in responses if not isinstance(r, Exception))
            print(f"  Created {success}/{len(batch)} in batch {i//batch_size + 1}")

        async with session.get(BASE_URL) as response:
            final_data = await response.json()
            final_count = len(final_data.get('question', []))
            if final_count >= 100:
                print(f"Successfully populated {final_count} questions")
                return True
            print(f"Failed to populate questions: {final_count}/100")
            return False

async def test_endpoint(session, url, params=None):
    start = time.monotonic()
    try:
        async with session.get(url, params=params) as response:
            await response.read()
            if response.status == 200:
                return time.monotonic() - start
    except Exception as e:
        pass
    return None

async def test_performance():
    endpoints = [
        ("GET All", BASE_URL, None),
        ("Search by Title", f"{BASE_URL}/{quote(SAMPLE_TITLE)}", None),
        ("Random Question", f"{BASE_URL}/random", {
            "complexity": SAMPLE_COMPLEXITY,
            "categories": SAMPLE_CATEGORY
        })
    ]

    results = {}

    async with ClientSession() as session:
        for name, url, params in endpoints:
            print(f"\nTesting {name}...")
            timings = []
            tasks = [test_endpoint(session, url, params) for _ in range(10)]

            for future in asyncio.as_completed(tasks):
                result = await future
                if result is not None:
                    timings.append(result)
                print(f"  Completed {len(timings)}/10 requests", end="\r")

            if timings:
                timings.sort()
                percentile_90 = timings[8]
                results[name] = {
                    "percentile_90": percentile_90,
                    "success_rate": len(timings)/10
                }
            else:
                results[name] = None

    return results

async def main():
    print("Starting NFR3.1 Validation")

    if not await populate_questions():
        print("Aborting test: Question population failed")
        return

    print("\n Starting performance tests")
    results = await test_performance()

    print("\nTest Results:")
    all_passed = True
    for endpoint, data in results.items():
        if not data:
            print(f"{endpoint}: All requests failed")
            all_passed = False
            continue

        status = "PASS" if data['percentile_90'] <= 3 else "FAIL"
        print(f"{endpoint}:")
        print(f"  90th percentile: {data['percentile_90']:.2f}s")
        print(f"  Success rate: {data['success_rate']:.0%}")

        if status == "FAIL":
            all_passed = False

    if all_passed:
        print("\nAll tests passed NFR3.1 requirements!")
    else:
        print("\ Some tests failed to meet requirements")

if __name__ == "__main__":
    asyncio.run(main())

