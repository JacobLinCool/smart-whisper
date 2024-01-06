process.env.GGML_METAL_PATH_RESOURCES =
	process.env.GGML_METAL_PATH_RESOURCES || path.join(__dirname, "../whisper.cpp");

import path from "node:path";
import { TranscribeParams, TranscribeResult } from "./types";
const module = require(path.join(__dirname, "../build/Release/smart-whisper"));

/**
 * A external handle to a model.
 */
export type Handle = unknown;

export interface Binding {
	/**
	 * Load a model from a whisper weights file.
	 * @param file The path to the whisper weights file.
	 * @param gpu Whether to use the GPU or not.
	 * @param callback A callback that will be called with the handle to the model.
	 */
	load(file: string, gpu: boolean, callback: (handle: Handle) => void): void;

	/**
	 * Release the memory of the model, it will be unusable after this.
	 * @param handle The handle to the model.
	 * @param callback A callback that will be called when the model is freed.
	 */
	free(handle: Handle, callback: () => void): void;

	/**
	 * Transcribe a PCM buffer.
	 * @param handle The handle to the model.
	 * @param pcm The PCM buffer.
	 * @param params The parameters to use for transcription.
	 * @param finish A callback that will be called when the transcription is finished.
	 */
	transcribe(
		handle: Handle,
		pcm: Float32Array,
		params: Partial<TranscribeParams>,
		finish: (results: TranscribeResult[]) => void,
	): void;
}

/**
 * The native binding for the underlying C++ addon.
 */
export const binding: Binding = module;
