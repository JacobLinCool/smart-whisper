import { Whisper } from "../dist";
import { decode } from "node-wav";
import fs from "node:fs";
import path from "node:path";

// tsx transcribe-dir.ts tiny.bin ./samples
// tsx transcribe-dir.ts tiny.bin '{"language": "zh"}' ./samples

const model = process.argv[2];

const dir =
	process.argv.length === 4
		? process.argv[3]
		: process.argv.length === 5
			? process.argv[4]
			: process.cwd();
const options = process.argv.length === 5 ? JSON.parse(process.argv[3]) : {};

const whisper = new Whisper(model, { gpu: true });

(async () => {
	for (const file of fs.readdirSync(dir)) {
		if (!file.endsWith(".wav")) {
			continue;
		}

		const wav = path.join(dir, file);
		const pcm = read_wav(wav);
		const { result } = await whisper.transcribe(pcm, options);
		const json = JSON.stringify(await result, null, 2);
		console.log(`${wav}: ${json}`);
		fs.writeFileSync(`${wav}.json`, json);
	}
	await whisper.free();
})();

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
