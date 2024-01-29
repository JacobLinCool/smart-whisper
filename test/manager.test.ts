import { manager } from "../src";
import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

it(
	"model manager should work",
	async () => {
		const p = path.join(manager.dir.models, "base.bin");
		if (fs.existsSync(p)) {
			fs.unlinkSync(p);
		}

		expect(manager.list()).not.toContain("base");

		const name = await manager.download("base");
		expect(name).toBe("base");

		const resolved = manager.resolve(name);
		expect(fs.existsSync(resolved)).toBe(true);

		expect(manager.list()).toContain("base");
	},
	{ timeout: 120_000 },
);
