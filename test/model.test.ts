import { manager, Whisper, WhisperModel } from "../src";
import { it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import { decode } from "node-wav";

beforeAll(async () => {
	await manager.download("tiny");
});

it(
	"model should load",
	async () => {
		const fp = manager.resolve("tiny");
		const model = await WhisperModel.load(fp, false);
		expect(model.freed).toBe(false);
		expect(model.handle).not.toBe(null);
		await model.free();
		expect(model.freed).toBe(true);
		expect(model.handle).toBe(null);
	},
	{ timeout: 60_000 },
);

it(
	"model should work",
	async () => {
		const fp = manager.resolve("tiny");
		const whisper = new Whisper(fp, { gpu: false });
		const pcm = read_wav("./whisper.cpp/samples/jfk.wav");

		const { result } = await whisper.transcribe(pcm);
		const results = await result;
		expect(results[0].text).toMatchSnapshot();

		await whisper.free();
	},
	{ timeout: 60_000 },
);

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
