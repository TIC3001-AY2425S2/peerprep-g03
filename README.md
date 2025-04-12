[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/-9a38Lm0)
# TIC3001 Project

## Pre-requisites
Install Docker
https://www.docker.com/products/docker-desktop/

## Getting Started With Docker
Start by docker compose
```
docker compose up -d
```
Head to frontend url
```
http://localhost:5173/
```
Tear down docker
```
docker compose down
```
# Below are not needed if you are running on docker

## Frontend
### Installation
Install the dependencies:
```bash
npm install
```

### Development
Start the development server with HMR:
```bash
npm run dev
```

#### Linting & Formatting
Run ESLint to check for code quality issues:
```bash
npx eslint . --fix
```

Run Prettier to format the code:
```bash
npx prettier --write .
```

### Mock Data (Simulating API Calls)
#### Using `json-server`
A `json-server` is included in the **dev dependencies** for simulating API calls.
To seed mock data, create a file at:
```sh
$PROJECT_DIR/frontend/data/db.json
```

#### Example `db.json` (Randomly Generated Data)
```json
{
  "questions": [
    {
      "id": "1",
      "title": "Find the Missing Number",
      "description": "Given an array containing...",
      "categories": ["Math", "Sorting"],
      "complexity": "Medium"
    },
    {
      "id": "2",
      "title": "Robot Movement Path",
      "description": "A robot can move up, down, left, or right...",
      "categories": ["Strings", "Simulation"],
      "complexity": "Easy"
    }
  ]
}
```

#### Running `json-server`
To start the mock API server, run:
```sh
npx json-server --watch data/db.json --port 5000 --routes ./json-server-routes.json
```
This will expose RESTful endpoints at `http://localhost:5000/api/questions`.

🔗 More details: [json-server](https://www.npmjs.com/package/json-server)


## Database
Ensure your are at root level of project to run docker compose
```
docker compose up -d  
```
Data should be store in docker volume. This should clear any cache and reintialise sample 20 questions of data
```
docker compose down -v
docker compose up -d  
```
Sample DB commands
```
docker exec -it mongo-central mongosh -u root -p example
use peerPrepDB
db.questions.find().limit(1)
db.questions.find().count()
```

## Backend
Head to backend folder
```
cd backend
```
Install dependencies
```
npm install 
 ```
Run the server
```
npm run dev
 ```
### Sample Test
Create question
```
curl -X POST -H "Content-Type: application/json" -d '{
"title": "Reverse String",
"description": "Write a function that reverses a string...",
"category": ["Strings", "Algorithms"],
"complexity": "Easy",
"link": "https://leetcode.com/problems/reverse-string"
}' http://localhost:4000/api/questions
```
Filter questions by complexity
```
curl "http://localhost:4000/api/questions?complexity=Easy"
```



## User Service

### Quick Start

1. In the `user-service` directory, create a copy of the `.env.sample` file and name it `.env`.
2. Create a MongoDB Atlas Cluster and obtain the connection string.
3. Add the connection string to the `.env` file under the variable `DB_CLOUD_URI`.
4. Ensure you are in the `user-service` directory, then install project dependencies with `npm install`.
5. Start the User Service with `npm start` or `npm run dev`.
6. If the server starts successfully, you will see a "User service server listening on ..." message.

### Complete User Service Guide: [User Service Guide](backend/src/user-service/README.md)

