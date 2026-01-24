Message persistence notes

How a UIMessage is created (useChat)
- `useChat` maintains the UIMessage[] state on the client.
- When you call `sendMessage({ text })`, it creates a user UIMessage locally.
- As the server streams back chunks, `useChat` appends assistant UIMessage parts.

Example:
```ts
const { messages, sendMessage } = useChat();

sendMessage({ text: 'Hello!' });
// messages now includes a UIMessage like:
// { id, role: 'user', parts: [{ type: 'text', text: 'Hello!' }] }
```

Normalized persistence: step-by-step

Step 1: Start in main.ts (no DB write yet)
- You have a MyUIMessage with id, role, and parts.
- You call `mapUIMessagePartsToDBParts(message.parts, message.id)`.
- This only prepares "row-shaped" objects for the parts table.

Pseudo:
```ts
const dbMessageParts = mapUIMessagePartsToDBParts(
  message.parts,
  message.id,
);
```

Step 2: mapping.ts (UI parts -> DB parts)
- `mapUIMessagePartsToDBParts` uses a switch on `part.type`.
- Each part becomes one row in the `parts` table.

Example outputs for the sample message:
```ts
// text part
{
  messageId: '123',
  order: 0,
  type: 'text',
  text_text: 'Hello!',
}

// reasoning part
{
  messageId: '123',
  order: 1,
  type: 'reasoning',
  reasoning_text: 'I am thinking...',
  providerMetadata: undefined,
}

// tool part (getWeatherInformation)
{
  messageId: '123',
  order: 2,
  type: 'tool-getWeatherInformation',
  tool_toolCallId: '123',
  tool_state: 'output-available',
  tool_getWeatherInformation_input: { city: 'London' },
  tool_getWeatherInformation_output: { city: 'London', weather: 'sunny' },
}
```

Step 3: schema.ts (where rows go)
- `messages` table: one row per message.
- `parts` table: many rows per message.
- `parts.messageId` is a foreign key to `messages.id`.

Step 4: Insert into the DB (pseudo code)
```ts
await db.insert(messages).values({
  id: message.id,
  chatId: chatId,
  role: message.role,
});

const dbParts = mapUIMessagePartsToDBParts(
  message.parts,
  message.id,
);

await db.insert(parts).values(dbParts);
```

Step 5: Read back one message
```ts
const messageRow = await db
  .select()
  .from(messages)
  .where(eq(messages.id, '123'))
  .limit(1);

const partRows = await db
  .select()
  .from(parts)
  .where(eq(parts.messageId, '123'))
  .orderBy(parts.order);

const uiParts = partRows.map(mapDBPartToUIMessagePart);

const uiMessage = {
  id: messageRow.id,
  role: messageRow.role,
  parts: uiParts,
};
```

Step 6: Read back a whole chat
```ts
const messageRows = await db
  .select()
  .from(messages)
  .where(eq(messages.chatId, chatId))
  .orderBy(messages.createdAt);

const partRows = await db
  .select()
  .from(parts)
  .where(inArray(parts.messageId, messageRows.map(m => m.id)))
  .orderBy(parts.messageId, parts.order);

const partsByMessage = groupBy(partRows, p => p.messageId);

const uiMessages = messageRows.map((m) => ({
  id: m.id,
  role: m.role,
  parts: (partsByMessage[m.id] ?? []).map(
    mapDBPartToUIMessagePart,
  ),
}));
```

Where this lives in the repo
- `exercises/04-persistence/04.04-persistence-in-a-normalized-db/explainer/main.ts`
- `exercises/04-persistence/04.04-persistence-in-a-normalized-db/explainer/mapping.ts`
- `exercises/04-persistence/04.04-persistence-in-a-normalized-db/explainer/schema.ts`
