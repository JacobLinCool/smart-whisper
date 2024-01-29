import { manager } from "../src";
import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

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
