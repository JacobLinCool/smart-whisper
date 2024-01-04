# smart-whisper

Whisper.cpp Node.js binding with auto model offloading.

## Features

- [x] Load model once, run inference multiple times
- [x] Auto model offloading and reloading

## Example

```ts
import { Whisper } from "smart-whisper";
import { decode } from "node-wav";
import fs from "node:fs";

const model = process.argv[2];
const wav = process.argv[3];

const whisper = new Whisper(model, { gpu: true });
const pcm = read_wav(wav);

const { result } = await whisper.transcribe(pcm, { language: "auto" });
console.log(await result);

await whisper.free();
console.log("Maunally freed");

function read_wav(file: string): Float32Array {
    const { sampleRate, channelData } = decode(fs.readFileSync(file));

    if (sampleRate !== 16000) {
        throw new Error(`Invalid sample rate: ${sampleRate}`);
    }
    if (channelData.length !== 1) {
        throw new Error(`Invalid channel count: ${channelData.length}`);
    }

    return channelData[0];
}
```
