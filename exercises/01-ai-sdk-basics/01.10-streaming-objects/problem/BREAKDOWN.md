# Streaming Objects - Simple Breakdown

## What This Code Does

This code demonstrates two different ways to get data from an LLM:
1. Streaming plain text
2. Streaming structured data (objects)

## Part 1: Streaming Text

```ts
const stream = streamText({
  model,
  prompt: 'Give me the first paragraph of a story about an imaginary planet.',
});
```

This asks the LLM to write a story paragraph. The response streams back word by word.

```ts
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

This loop prints each word as it arrives. You see the text appear gradually, not all at once.

```ts
const finalText = await stream.text;
```

This waits for the complete text. After the stream finishes, `finalText` contains the full paragraph.

## Part 2: Streaming Objects

```ts
const factsResult = streamObject({
  model,
  prompt: `Give me some facts about the imaginary planet. Here's the story: ${finalText}`,
  schema: z.object({
    facts: z.array(z.string()).describe('The facts about the imaginary planet. Write as if you are a scientist.'),
  }),
});
```

This is different from `streamText`. Instead of getting plain text, we get structured data.

### The Schema

```ts
schema: z.object({
  facts: z.array(z.string())
})
```

The schema defines the structure we want. We're telling the LLM:
- Give me an object
- The object should have a `facts` property
- `facts` should be an array of strings

The LLM will generate data that matches this structure.

### Partial Object Stream

```ts
for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}
```

This is the key difference. As the LLM generates the response, we get partial versions of the object.

**Example output:**
```ts
{} // First chunk: empty object
{ facts: ['Xylos orbits a binary star system.'] } // Second chunk: one fact
{ facts: ['Xylos orbits a binary star system.', 'The dominant colors...' ] } // Third chunk: two facts
```

Each chunk is a valid JavaScript object. The array grows as more facts are generated.

### Final Object

```ts
const object = await factsResult.object;
console.log(object);
```

This waits for the complete object with all facts.

## Why Use streamObject Instead of streamText?

### With streamText

You get: `"Fact 1: Xylos orbits a binary star. Fact 2: The planet has..."`

This is just a string. To use it, you need to:
1. Parse the text manually
2. Extract the facts yourself
3. Handle formatting inconsistencies

### With streamObject

You get: `{ facts: ['Xylos orbits a binary star', 'The planet has...'] }`

This is structured data. You can:
1. Access facts directly: `object.facts[0]`
2. Loop through facts easily
3. No parsing needed

## Key Concepts

### Zod Schema

Zod is a validation library. The schema tells the LLM what structure to generate.

```ts
z.object({ facts: z.array(z.string()) })
```

This means: "Generate an object with a facts array containing strings."

The LLM understands this and formats its response accordingly.

### Partial Objects

As the LLM generates the response, you get incomplete versions of the final object.

**Why is this useful?**
- Show progress to users
- Display data as it arrives
- Better user experience than waiting

### Streaming vs Waiting

**Streaming:**
```ts
for await (const chunk of factsResult.partialObjectStream) {
  // Process each partial object
}
```

**Waiting:**
```ts
const object = await factsResult.object;
// Get complete object at once
```

You can do both. Stream to show progress, then use the final object for processing.

## Real World Use Cases

### Product Recommendations

```ts
streamObject({
  schema: z.object({
    products: z.array(z.object({
      name: z.string(),
      price: z.number(),
      reason: z.string()
    }))
  })
})
```

Display products as they're generated instead of waiting for all recommendations.

### Form Generation

```ts
streamObject({
  schema: z.object({
    fields: z.array(z.object({
      label: z.string(),
      type: z.enum(['text', 'email', 'number']),
      required: z.boolean()
    }))
  })
})
```

Show form fields as the LLM generates them.

### Data Extraction

```ts
streamObject({
  schema: z.object({
    entities: z.array(z.object({
      name: z.string(),
      type: z.string(),
      confidence: z.number()
    }))
  })
})
```

Extract structured data from unstructured text.

## Important Differences

### streamText
- Returns plain text
- Good for essays, stories, explanations
- You handle parsing and structure

### streamObject
- Returns structured data
- Good for lists, forms, data extraction
- LLM handles structure for you

## The Flow

1. First request generates a story (text)
2. We wait for the complete story
3. Second request analyzes the story (structured data)
4. We stream the facts as they're generated
5. Each chunk is a valid object with more facts
6. Finally we have the complete list

## Why This Matters

Traditional approach: Ask LLM for facts, get text, parse text, hope format is correct.

Modern approach: Define structure with schema, get valid objects, no parsing needed.

The LLM becomes a structured data generator, not just a text generator.
