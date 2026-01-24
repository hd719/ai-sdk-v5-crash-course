Message types in this course (section 4 level)

1) UIMessage
What it is: the message shape your UI renders and your DB stores.
Why it exists: it keeps IDs, roles, and parts for display and persistence.
Example:
```ts
const uiMessages = [
  {
    id: 'msg_1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello there' }],
  },
];
```

2) ModelMessage
What it is: the stripped down message format sent to the LLM.
Why it exists: the model does not care about UI IDs or UI parts.
Example:
```ts
const modelMessages = [
  {
    role: 'user',
    content: [{ type: 'text', text: 'Hello there' }],
  },
];
```

3) AssistantModelMessage and ToolModelMessage
What they are: the model-side message flavors you see in streamText.onFinish.
Why they exist: they represent assistant replies and tool calls/results without UI extras.
Example:
```ts
const responseMessages = [
  { role: 'assistant', content: [{ type: 'text', text: 'Hi!' }] },
];
```

4) UIMessagePart
What it is: the individual pieces inside a UIMessage.
Why it exists: a message can be text, tools, images, data, and more.
Example:
```ts
const parts = [
  { type: 'text', text: 'A text part' },
];
```

5) MyDBUIMessagePart and MyDBUIMessagePartSelect
What they are: DB row shapes used in the normalized persistence example.
Why they exist: store each UIMessage part as a row; insert vs select shapes.
Example:
```ts
const dbPart = {
  messageId: 'msg_1',
  type: 'text',
  text_text: 'Hello there',
};
```

6) UIMessageStream
What it is: the streaming form of a UIMessage as it is built on the backend.
Why it exists: lets the UI update token by token, part by part.
Example:
```txt
{ type: 'start' }
{ type: 'text-start', id: '0' }
{ type: 'text-delta', id: '0', delta: 'H' }
{ type: 'text-end', id: '0' }
{ type: 'finish' }
```

Quick rule of thumb
- UIMessage is for people and databases.
- ModelMessage is for the model.
- UIMessageStream is for real-time updates.
