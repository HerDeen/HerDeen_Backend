# HerDeen Backend

This is the backend service for the HerDeen application, an Islamic lifestyle and productivity platform.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB
- Redis (for BullMQ job queues)
- pnpm (recommended package manager)

### 2. Installation
Install the project dependencies:
```bash
pnpm install
```

### 3. Environment Configuration
Copy the example environment file and fill in your actual credentials:
```bash
cp .env.example .env
```
Ensure you have configured `GEMINI_API_KEY` (obtained from [Google AI Studio](https://aistudio.google.com/)).

### 4. Running the Application
To run the main Express application:
```bash
pnpm run dev
```

To run the background worker (for generating daily plans):
```bash
pnpm run worker
```

---

## LLM Integration & Migration

The daily planning assistant was migrated from **OpenRouter** to **Gemini** (using the model `gemini-flash-latest`) via the OpenAI Compatibility layer. 

### Testing the LLM Connection
A standalone script is provided in the project root to test your Gemini connection without running the database or starting the backend server.

To run the test:
```bash
export GEMINI_API_KEY="your_api_key_here" && npx ts-node-dev --transpile-only testGemini.ts
```
On successful run, it will print:
```
 Connecting to Gemini API...
 Success! Gemini Response: "Welcome!"
```
