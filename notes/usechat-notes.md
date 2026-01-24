UseChat, plain and simple

- `useChat` posts to `/api/chat` by default. Same origin, same port. No magic.
- It only hits your backend when you call `sendMessage`.
- The GET you saw is your app code, not the hook. That GET is for loading saved history.
- Default endpoint is set in `node_modules/ai/dist/index.mjs` (the HTTP transport).
- Want a different URL? Pass `api: '/api/whatever'` to `useChat`.

Where we covered it in the course

- `exercises/01-ai-sdk-basics/01.07-stream-text-to-ui/problem/BREAKDOWN.md`
- `exercises/01-ai-sdk-basics/01.07-stream-text-to-ui/problem/readme.md`
- Persistence GET is shown in `exercises/04-persistence/04.03-persistence/problem/readme.md`
