import { google } from '@ai-sdk/google';
import { streamObject, streamText } from 'ai';
import z from 'zod';

const model = google('gemini-2.0-flash');

const stream = streamText({
  model,
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;

// TODO: Replace this with a call to streamObject, passing:
// - The model, same as above
// - The prompt, asking for facts about the imaginary planet,
//   passing in the finalText as the story
// - The schema, which should be an object with a facts property
//   that is an array of strings
const factsResult = streamObject({
  model,
  prompt: `Give me some facts about the imaginary planet. Here's the story: ${finalText}`,
  schema: z.object({
    facts: z
      .array(z.string())
      .describe(
        'The facts about the imaginary planet. Write as if you are a scientist.',
      ),
  }),
});

for await (const chunk of factsResult.partialObjectStream) {
  console.log(chunk);
}

// Ouput:
// Xylos, a world painted in hues of violet and ochre, orbited a binary sun, casting long, dancing shadows that never truly settled. Towering, crystalline trees, their branches shimmering with trapped starlight, scraped against a sky perpetually twilight. The ground beneath them was a tapestry of phosphorescent moss and bubbling pools of liquid methane, emitting a low, rhythmic hum that resonated through the very bones of the strange, six-legged creatures that roamed its surface. It was a landscape both beautiful and alien, a testament to the boundless creativity of the universe, and a place where the laws of physics seemed more like suggestions than unbreakable rules.
// {}
// { facts: [ 'Xylos orbits a binary star system.' ] }
// {
//   facts: [
//     'Xylos orbits a binary star system.',
//     "The dominant colors of Xylos' landscape are violet and ochre.",
//     'The planet features crystalline trees that appear to trap starlight within their structure.',
//     'The ground is covered in phosphorescent moss and pools of liquid methane.'
//   ]
// }
// {
//   facts: [
//     'Xylos orbits a binary star system.',
//     "The dominant colors of Xylos' landscape are violet and ochre.",
//     'The planet features crystalline trees that appear to trap starlight within their structure.',
//     'The ground is covered in phosphorescent moss and pools of liquid methane.',
//     'The methane pools emit a rhythmic humming sound.',
//     'Six-legged creatures inhabit Xylos.'
//   ]
// }
