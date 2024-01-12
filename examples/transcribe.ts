import { Whisper } from "../dist";
import { decode } from "node-wav";
import fs from "node:fs";

const model = process.argv[2];
const wav = process.argv[3];
const options = process.argv[4] ? JSON.parse(process.argv[4]) : {};

const whisper = new Whisper(model, { gpu: true });

(async () => {
	const pcm = read_wav(wav);
	await transcribe(pcm);
	await whisper.free();
})();

async function transcribe(pcm: Float32Array): Promise<void> {
	const { result } = await whisper.transcribe(pcm, options);
	console.log(JSON.stringify(await result, null, 2));
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
