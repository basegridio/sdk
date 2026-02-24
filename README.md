# @basegrid-io/core

[![npm version](https://badge.fury.io/js/%40basegrid-io%2Fcore.svg)](https://www.npmjs.com/package/@basegrid-io/core)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

The official Node.js SDK for [BaseGrid](https://basegrid.io) — persistent memory infrastructure for AI agents.

Sub-200ms memory retrieval. Hybrid semantic search. Built for production.

---

## Installation

```bash
npm install @basegrid-io/core
```

---

## Quick Start

```typescript
import { BaseGrid } from '@basegrid-io/core';

const client = new BaseGrid({ apiKey: process.env.BASEGRID_API_KEY });

// Store a memory
await client.memory.store({
  agentId: 'support-bot',
  content: 'User prefers concise answers and dislikes jargon',
});

// Recall relevant memories
const memories = await client.memory.recall({
  agentId: 'support-bot',
  query: 'communication preferences',
  limit: 5,
});

console.log(memories);
```

---

## Usage with AI Frameworks

### With Vercel AI SDK

```typescript
import { BaseGrid } from '@basegrid-io/core';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const memory = new BaseGrid({ apiKey: process.env.BASEGRID_API_KEY });

// Retrieve context before generating
const memories = await memory.recall({ agentId: 'assistant', query: userMessage });
const context = memories.map(m => m.content).join('\n');

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: `Context from memory:\n${context}\n\nUser: ${userMessage}`,
});

// Store the interaction
await memory.store({ agentId: 'assistant', content: `User asked: ${userMessage}` });
```

### With LangChain

```typescript
import { BaseGrid } from '@basegrid-io/core';

const memory = new BaseGrid({ apiKey: process.env.BASEGRID_API_KEY });

// Use as a memory layer in your chain
const relevantMemories = await memory.recall({
  agentId: 'langchain-agent',
  query: input,
});
```

---

## API Reference

### `client.memory.store(options)`

```typescript
await client.memory.store({
  agentId: string,       // Required: namespace for this agent
  content: string,       // Required: the memory content
  metadata?: object,     // Optional: key-value metadata
  importance?: number,   // Optional: 0-1 (default: 0.5)
});
```

### `client.memory.recall(options)`

```typescript
const memories = await client.memory.recall({
  agentId: string,   // Required: namespace to search
  query: string,     // Required: semantic search query
  limit?: number,    // Optional: max results (default: 5)
});
```

### `client.memory.list(options)`

```typescript
const memories = await client.memory.list({
  agentId: string,   // Required
  limit?: number,    // Optional: (default: 10)
});
```

### `client.memory.forget(memoryId: string)`

```typescript
await client.memory.forget('memory_id_here');
```

---

## Configuration

```typescript
const client = new BaseGrid({
  apiKey: process.env.BASEGRID_API_KEY,  // Required
  baseUrl?: string,                        // Optional: default https://api.basegrid.io
  timeout?: number,                        // Optional: ms (default: 10000)
});
```

---

## Pricing

| Plan | Memories | API Calls/Month | Price |
|------|----------|-----------------|-------|
| Free Trial | 500K | 1,000 | Free for 2 months |
| Pro Starter | 500K | 5M | $49/month |
| Pro Plus | 2M | 20M | $79/month |
| Scale | 10M | 50M | $199/month |

Self-hosting available on Scale plan. Get your key at **[basegrid.io](https://basegrid.io)**

---

## Requirements

- Node.js 18+
- A BaseGrid API key ([get one free](https://basegrid.io))

---

## Other SDKs

- **Python:** `pip install basegrid-io` → [basegridio/basegrid-python](https://github.com/basegridio/basegrid-python)
- **Go:** `go get github.com/basegridio/basegrid-go` → [basegridio/basegrid-go](https://github.com/basegridio/basegrid-go)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Apache 2.0 — see [LICENSE](LICENSE)

Built by [BaseGrid](https://basegrid.io) · [Docs](https://basegrid.io/docs) · [Discord](https://discord.gg/basegrid)
