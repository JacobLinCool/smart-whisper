import { binding } from "./binding";

type Handle = unknown;

export class WhisperModel {
	private _handle: Handle;
	private _freed: Promise<boolean>;

	constructor(handle: Handle) {
		this._handle = handle;
		this._freed = Promise.resolve(false);
	}

	get handle(): Handle {
		return this._handle;
	}

	get freed(): Promise<boolean> {
		return this._freed;
	}

	/**
	 * Release the memory of the model, it will be unusable after this.
	 * It's safe to call this multiple times, but it will only free the model once.
	 */
	async free(): Promise<void> {
		if (await this._freed) {
			return;
		}
		this._freed = new Promise<void>((resolve) => binding.free(this.handle, resolve)).then(
			() => true,
		);
		await this._freed;
	}

	/**
	 * Load a model from a whisper weights file.
	 * @param file The path to the whisper weights file.
	 * @param gpu Whether to use the GPU or not.
	 * @returns A promise that resolves to a {@link WhisperModel}.
	 */
	static async load(file: string, gpu = false): Promise<WhisperModel> {
		return new Promise((resolve) => {
			binding.load(file, gpu, (handle) => resolve(new WhisperModel(handle)));
		});
	}
}
