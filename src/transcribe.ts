import EventEmitter from "node:events";
import type { WhisperModel } from "./model";
import { TranscribeParams, TranscribeResult } from "./types";
import { binding } from "./binding";

export class TranscribeTask extends EventEmitter {
	private _model: WhisperModel;

	constructor(model: WhisperModel) {
		super();
		this._model = model;
	}

	get model(): WhisperModel {
		return this._model;
	}

	async run(pcm: Float32Array, params: Partial<TranscribeParams>): Promise<TranscribeResult[]> {
		if (await this.model.freed) {
			throw new Error("Model has been freed");
		}

		return new Promise((resolve) => {
			binding.transcribe(this.model.handle, pcm, params, (results) => {
				this.emit("finish");
				resolve(results);
			});
		});
	}
}
