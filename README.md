# smart-whisper

Smart-Whisper is a native Node.js addon designed for efficient and streamlined interaction with the [whisper.cpp](https://github.com/ggerganov/whisper.cpp), with automatic model offloading and reloading and model manager.

## Features

- **Node.js Native Addon Interaction**: Directly interact with whisper.cpp, ensuring fast and efficient processing.
- **Single Model Load for Multiple Inferences**: Load the model once and perform multiple and parallel inferences, optimizing resource usage and reducing load times.
- **Automatic Model Offloading and Reloading**: Manages memory effectively by automatically offloading and reloading models as needed.
- **Model Manager**: Automates the process of downloading and updating models, ensuring that the latest models are always available.

## Installation

```sh
npm i smart-whisper
```

## Documentation

The documentation is available at <https://jacoblincool.github.io/smart-whisper/>.

## Example

See [examples](./examples) for more examples.

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

## Links

- [GitHub Repository](https://github.com/JacobLinCool/smart-whisper)
- [NPM Package](https://www.npmjs.com/package/smart-whisper)
- [Documentation](https://jacoblincool.github.io/smart-whisper/)

## License

[MIT](./LICENSE)
