# AegisAI-SPM Setup Guide

## Prerequisites
- **Node.js** (v18 or higher)
- **Docker Desktop** (for the database)
- **AWS Credentials** (for real scanning)

## 1. Database Setup (Neo4j)
We use a graph database to analyze relationships between assets.

1.  Make sure Docker Desktop is running.
2.  Open a terminal in this project root.
3.  Run the database:
    ```bash
    docker-compose up -d
    ```
4.  Verify it's running by opening [http://localhost:7474](http://localhost:7474).
    - **Username**: neo4j
    - **Password**: password

## 2. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure AWS (Optional for Mock Mode):
    - Create a `.env` file in `/backend` (see `env.example` or code).
    - Or ensure you have `~/.aws/credentials` set up.
4.  Start the server:
    ```bash
    npm start
    ```

## 3. Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Troubleshooting
- **Database Connection Error**: Ensure the container is running (`docker ps`) and port 7687 is available.
- **AWS Errors**: If you don't have AWS credentials, the system will use Mock Data automatically.
