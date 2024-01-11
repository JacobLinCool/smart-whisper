import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/linker.ts"],
	outDir: "dist",
	dts: true,
});
