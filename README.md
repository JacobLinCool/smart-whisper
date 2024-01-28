# smart-whisper

Smart-Whisper is a native Node.js addon designed for efficient and streamlined interaction with the [whisper.cpp](https://github.com/ggerganov/whisper.cpp), with automatic model offloading and reloading and model manager.

## Features

- **Node.js Native Addon Interaction**: Directly interact with whisper.cpp, ensuring fast and efficient processing.
- **Single Model Load for Multiple Inferences**: Load the model once and perform multiple and parallel inferences, optimizing resource usage and reducing load times.
- **Automatic Model Offloading and Reloading**: Manages memory effectively by automatically offloading and reloading models as needed.
- **Model Manager**: Automates the process of downloading and updating models, ensuring that the latest models are always available.

## Installation

The standard installation supports Windows, macOS, and Linux out of the box. And it also automatically enables the GPU and CPU acceleration on macOS.

```sh
npm i smart-whisper
```

Support Matrix:

| OS and Arch         | CPU              | GPU       |
| ------------------- | ---------------- | --------- |
| macOS Apple Silicon | ✅ (Acceleration) | ✅ (Metal) |
| macOS Intel         | ✅ (Acceleration) | BYOL      |
| Linux / Windows     | ✅                | BYOL      |

> - ✅: Out of the box support with standard installation.
> - BYOL: Bring Your Own Library, see [Acceleration](#acceleration) for more information.

### Acceleration

Due to the complexity of the different acceleration methods for different devices. You need to compile the `libwhisper.a` or `libwhisper.so` from [whisper.cpp](https://github.com/ggerganov/whisper.cpp) yourself.

And then set the `BYOL` (Bring Your Own Library) environment variable to the path of the compiled library.

```sh
BYOL='/path/to/libwhisper.a' npm i smart-whisper
```

You may need to link other libraries like:

```sh
BYOL='/path/to/libwhisper.a -lopenblas' npm i smart-whisper
```

#### OpenBLAS

For Linux and Windows without GPU, the best acceleration method might be using OpenBLAS. After installing OpenBLAS, you can compile the `libwhisper.a` with the following command:

```sh
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
WHISPER_OPENBLAS=1 make -j
```

#### CUDA and other acceleration methods

Check out the [whisper.cpp](https://github.com/ggerganov/whisper.cpp#nvidia-gpu-support) repository for more information.

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

const task = await whisper.transcribe(pcm, { language: "auto" });
console.log(await task.result);

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

The transcribe method returns a task object that can be used to retrieve the result of the transcription, which also emits events for the progress of the transcription.

```ts
const task = await whisper.transcribe(pcm, { language: "auto" });
task.on("transcribed", (result) => {
    console.log("Transcribed", result);
});
console.log(await task.result);
```

## Links

- [GitHub Repository](https://github.com/JacobLinCool/smart-whisper)
- [NPM Package](https://www.npmjs.com/package/smart-whisper)
- [Documentation](https://jacoblincool.github.io/smart-whisper/)

## License

[MIT](./LICENSE)
