# What is the AI SDK?

## Overview

The AI SDK is a TypeScript library that simplifies working with Large Language Models (LLMs). It's a widely-adopted tool with 2.5+ million downloads per week, built and maintained by Vercel's core team. Despite being developed by Vercel, the AI SDK runs anywhere JavaScript runs—not just on Vercel infrastructure.

## Three Main Parts

### 1. Core (Backend)

- Runs anywhere JavaScript runs
- Install with a single package: `ai`
- Provides the foundational functionality for working with LLMs

### 2. UI Hooks (Frontend)

- Framework-specific packages for major frameworks:
  - `@ai-sdk/react`
  - `@ai-sdk/vue`
  - `@ai-sdk/angular`
  - `@ai-sdk/svelte`
- Connects the backend to the frontend seamlessly

### 3. React Server Components

- Additional offering for React Server Components
- Less commonly used compared to Core + UI approach

## Key Benefits

### Avoiding Vendor Lock-in

- Single unified API works with multiple AI providers
- Easy provider switching (e.g., `@ai-sdk/anthropic`)
- Many providers supported beyond the major ones
- New provider features typically supported on release day or within days

### Common Use Case Helpers

- Structured outputs
- Agent workflows
- **Streaming from backend to frontend** (extremely valuable—this is hard to implement manually)

### Developer Experience

- Straightforward and easy to use
- Not overly abstract or jargon-heavy
- Often described as "the standard library for TypeScript and AI"
- Stands out among frameworks for its simplicity and practicality

## Why Use the AI SDK?

**Learn once, use everywhere**: Master one set of tools and communicate with any supported AI model. The AI SDK abstracts away the complexity of working with different providers while providing powerful helpers for common patterns, especially the challenging task of streaming responses from backend to frontend.
