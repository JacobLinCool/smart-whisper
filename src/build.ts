import os from "node:os";
import { execSync } from "node:child_process";

type ComputeBackend = "cpu" | "accelerate" | "metal" | "clblast" | "openblas";

const cfg = config();

export const sources = cfg.sources.join(" ");
export const defines = cfg.defines.join(" ");
export const libraries = cfg.libraries.join(" ");

function config(): {
	sources: string[];
	defines: string[];
	libraries: string[];
} {
	if (process.env.BYOL) {
		return {
			sources: [],
			defines: [],
			libraries: [process.env.BYOL],
		};
	}

	const COMPUTE_BACKEND: ComputeBackend =
		(process.env.COMPUTE_BACKEND as ComputeBackend | undefined) ?? infer_backend();

	const cfg = {
		sources: [
			"whisper.cpp/whisper.cpp",
			"whisper.cpp/ggml.c",
			"whisper.cpp/ggml-alloc.c",
			"whisper.cpp/ggml-backend.c",
			"whisper.cpp/ggml-quants.c",
		] as string[],
		defines: [] as string[],
		libraries: [] as string[],
	};

	switch (COMPUTE_BACKEND) {
		case "accelerate": {
			cfg.defines.push("GGML_USE_ACCELERATE");

			cfg.libraries.push('"-framework Foundation"');
			cfg.libraries.push('"-framework Accelerate"');
			break;
		}
		case "metal": {
			cfg.sources.push("whisper.cpp/ggml-metal.m");

			cfg.defines.push("GGML_USE_ACCELERATE");
			cfg.defines.push("GGML_USE_METAL");

			cfg.libraries.push('"-framework Foundation"');
			cfg.libraries.push('"-framework Accelerate"');
			cfg.libraries.push('"-framework Metal"');
			cfg.libraries.push('"-framework MetalKit"');
			break;
		}
		case "openblas": {
			cfg.defines.push("GGML_USE_OPENBLAS");

			cfg.libraries.push("-lopenblas");
			break;
		}
		case "clblast": {
			cfg.sources.push("whisper.cpp/ggml-opencl.cpp");

			cfg.defines.push("GGML_USE_CLBLAST");

			cfg.libraries.push("-lclblast");
			if (os.platform() === "darwin") {
				cfg.libraries.push("-framework OpenCL");
			} else {
				cfg.libraries.push("-lOpenCL");
			}
			break;
		}
		default: {
		}
	}

	return cfg;
}

function infer_backend(): ComputeBackend {
	let backend: ComputeBackend = "cpu";

	try {
		if (os.platform() === "darwin") {
			backend = "accelerate";
			if (os.arch() === "arm64") {
				backend = "metal";
			}
		} else if (os.platform() === "linux") {
			const has_libopenblas = !!execSync("ldconfig -p | grep libopenblas").toString().trim();
			if (has_libopenblas) {
				backend = "openblas";
			}
		}
	} catch {
		// if anything goes wrong, just use the default cpu backend
	}

	return backend;
}
