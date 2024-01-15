import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/build.ts"],
	outDir: "dist",
	dts: true,
});
