export enum WhisperSamplingStrategy {
	WHISPER_SAMPLING_GREEDY,
	WHISPER_SAMPLING_BEAM_SEARCH,
}

export interface TranscribeParams {
	strategy: WhisperSamplingStrategy;
	n_threads: number;
	n_max_text_ctx: number;
	offset_ms: number;
	duration_ms: number;

	translate: boolean;
	no_context: boolean;
	no_timestamps: boolean;
	single_segment: boolean;
	print_special: boolean;
	print_progress: boolean;
	print_realtime: boolean;
	print_timestamps: boolean;

	initial_prompt: string;

	language: string;

	suppress_blank: boolean;
	suppress_non_speech_tokens: boolean;

	temperature: number;
	max_initial_ts: number;
	length_penalty: number;

	temperature_inc: number;
	entropy_thold: number;
	logprob_thold: number;

	beam_size: number;
}

export interface TranscribeResult {
	from: number;
	to: number;
	text: string;
}
