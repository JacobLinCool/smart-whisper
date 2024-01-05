import { manager, Whisper } from "../src";
import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decode } from "node-wav";

it(
	"model manager should work",
	async () => {
		const p = path.join(manager.dir.models, "tiny.bin");
		if (fs.existsSync(p)) {
			fs.unlinkSync(p);
		}

		expect(manager.list()).not.toContain("tiny");

		const name = await manager.download("tiny");
		expect(name).toBe("tiny");

		const resolved = manager.resolve(name);
		expect(fs.existsSync(resolved)).toBe(true);

		expect(manager.list()).toContain("tiny");
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
		expect(results).toMatchSnapshot();

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
