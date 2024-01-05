import { Whisper } from "../dist";
import { decode } from "node-wav";
import fs from "node:fs";

const model = process.argv[2];
const wav = "./whisper.cpp/samples/jfk.wav";

const whisper = new Whisper(model, { gpu: true });

(async () => {
	const pcm = read_wav(wav);
	await Promise.all(
		Array(4)
			.fill(0)
			.map((_, i) => transcribe(pcm).then(() => console.log("Done", i))),
	);
	await whisper.free();
	console.log("Manually freed");
})();

async function transcribe(pcm: Float32Array): Promise<void> {
	const { result } = await whisper.transcribe(pcm);
	console.log(await result);
}

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
