import type { TranscribeParams, TranscribeResult } from "./types";
import { WhisperModel } from "./model";
import { TranscribeTask } from "./transcribe";

export interface WhisperConfig {
	/**
	 * Time in seconds to wait before offloading the model if it's not being used.
	 */
	offload: number;

	/**
	 * Whether to use the GPU or not.
	 */
	gpu: boolean;
}

export class Whisper {
	private _file: string;
	private _available: WhisperModel | null = null;
	private _loading: Promise<WhisperModel> | null = null;
	private _tasks: Promise<TranscribeResult[]>[] = [];
	private _config: WhisperConfig;
	private _offload_timer: NodeJS.Timeout | null = null;

	constructor(file: string, config: Partial<WhisperConfig> = {}) {
		this._file = file;
		this._config = {
			offload: 300,
			gpu: false,
			...config,
		};
	}

	get file(): string {
		return this._file;
	}

	set file(file: string) {
		this._file = file;
	}

	get config(): WhisperConfig {
		return this._config;
	}

	get tasks(): Promise<TranscribeResult[]>[] {
		return this._tasks;
	}

	reset_offload_timer(): void {
		this.clear_offload_timer();
		this._offload_timer = setTimeout(() => {
			this.free();
		}, this.config.offload * 1000);
	}

	private clear_offload_timer(): void {
		if (this._offload_timer !== null) {
			clearTimeout(this._offload_timer);
			this._offload_timer = null;
		}
	}

	async model(): Promise<WhisperModel> {
		if (this._available === null) {
			return this.load();
		}
		this.reset_offload_timer();
		return Promise.resolve(this._available);
	}

	async load(): Promise<WhisperModel> {
		if (this._loading !== null) {
			return this._loading;
		}

		const model = WhisperModel.load(this.file, this.config.gpu);
		this._loading = model;
		this._available = await model;
		this._loading = null;
		this.reset_offload_timer();
		return this._available;
	}

	async transcribe(
		pcm: Float32Array,
		params: Partial<TranscribeParams> = {},
	): Promise<{ result: Promise<TranscribeResult[]> }> {
		const model = await this.model();
		const task = new TranscribeTask(model);
		const result = task.run(pcm, params);
		this._tasks.push(result);
		return { result };
	}

	async free(): Promise<void> {
		if (this._available === null) {
			return;
		}
		const model = this._available;
		this._available = null;
		this.clear_offload_timer();
		await Promise.all(this.tasks);
		await model.free();
	}
}
