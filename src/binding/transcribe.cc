#include "transcribe.h"

struct whisper_full_params whisper_full_params_from_js(Napi::Object o) {
    struct whisper_full_params params =
        whisper_full_default_params(whisper_sampling_strategy::WHISPER_SAMPLING_BEAM_SEARCH);

    if (o.Has("strategy")) {
        params.strategy = static_cast<whisper_sampling_strategy>(
            o.Get("strategy").As<Napi::Number>().Int32Value());
    }
    if (o.Has("n_threads")) {
        params.n_threads = o.Get("n_threads").As<Napi::Number>();
    }
    if (o.Has("n_max_text_ctx")) {
        params.n_max_text_ctx = o.Get("n_max_text_ctx").As<Napi::Number>();
    }
    if (o.Has("offset_ms")) {
        params.offset_ms = o.Get("offset_ms").As<Napi::Number>();
    }
    if (o.Has("duration_ms")) {
        params.duration_ms = o.Get("duration_ms").As<Napi::Number>();
    }

    if (o.Has("translate")) {
        params.translate = o.Get("translate").As<Napi::Boolean>();
    }
    if (o.Has("no_context")) {
        params.no_context = o.Get("no_context").As<Napi::Boolean>();
    }
    if (o.Has("no_timestamps")) {
        params.no_timestamps = o.Get("no_timestamps").As<Napi::Boolean>();
    }
    if (o.Has("single_segment")) {
        params.single_segment = o.Get("single_segment").As<Napi::Boolean>();
    }
    if (o.Has("print_special")) {
        params.print_special = o.Get("print_special").As<Napi::Boolean>();
    }
    if (o.Has("print_progress")) {
        params.print_progress = o.Get("print_progress").As<Napi::Boolean>();
    }
    if (o.Has("print_realtime")) {
        params.print_realtime = o.Get("print_realtime").As<Napi::Boolean>();
    }
    if (o.Has("print_timestamps")) {
        params.print_timestamps = o.Get("print_timestamps").As<Napi::Boolean>();
    }

    if (o.Has("initial_prompt")) {
        std::string initial_prompt = o.Get("initial_prompt").As<Napi::String>().Utf8Value();
        params.initial_prompt = initial_prompt.c_str();
    }
    if (o.Has("language")) {
        std::string language = o.Get("language").As<Napi::String>().Utf8Value();
        params.language = language.c_str();
    }

    if (o.Has("temperature")) {
        params.temperature = o.Get("temperature").As<Napi::Number>();
    }
    if (o.Has("max_initial_ts")) {
        params.max_initial_ts = o.Get("max_initial_ts").As<Napi::Number>();
    }
    if (o.Has("length_penalty")) {
        params.length_penalty = o.Get("length_penalty").As<Napi::Number>();
    }
    if (o.Has("temperature_inc")) {
        params.temperature_inc = o.Get("temperature_inc").As<Napi::Number>();
    }
    if (o.Has("entropy_thold")) {
        params.entropy_thold = o.Get("entropy_thold").As<Napi::Number>();
    }
    if (o.Has("logprob_thold")) {
        params.logprob_thold = o.Get("logprob_thold").As<Napi::Number>();
    }

    if (o.Has("beam_size")) {
        params.beam_search.beam_size = o.Get("beam_size").As<Napi::Number>();
    }

    return params;
}

class TranscribeWorker : public Napi::AsyncWorker {
   public:
    TranscribeWorker(whisper_context *context, const float *samples, int n_samples,
                     struct whisper_full_params params, Napi::Function &finish_callback)
        : AsyncWorker(finish_callback),
          context(context),
          samples(samples),
          n_samples(n_samples),
          params(params) {
        // tsfn = Napi::ThreadSafeFunction::New(receive_callback.Env(), receive_callback,
        //                                      "TranscribeWorkerCallback",  // just a name
        //                                      0,                           // unlimited queue
        //                                      1  // only one thread will use this function
        // );
        state = nullptr;
    }

    ~TranscribeWorker() {
        delete[] samples;
        // whisper_free_params(&params); will lead to a double free
        if (state != nullptr) {
            whisper_free_state(state);
        }
        // tsfn.Release();
    }

    void Execute() override {
        state = whisper_init_state(context);

        // params.new_segment_callback = [](struct whisper_context *ctx, struct whisper_state
        // *state,
        //                                  int n_new, void *user_data) {
        //     TranscribeWorker *worker = static_cast<TranscribeWorker *>(user_data);

        //     int           idx = n_new - 1;
        //     const int64_t from = whisper_full_get_segment_t0_from_state(state, idx) * 10;
        //     const int64_t to = whisper_full_get_segment_t1_from_state(state, idx) * 10;
        //     const char   *text = whisper_full_get_segment_text_from_state(state, idx);
        //     printf("new segment: %d %lld %lld %s\n", idx, from, to, text);

        //     worker->tsfn.BlockingCall([from, to, text](Napi::Env env, Napi::Function callback) {
        //         Napi::Object segment = Napi::Object::New(env);
        //         segment.Set("from", Napi::Number::New(env, from));
        //         segment.Set("to", Napi::Number::New(env, to));
        //         segment.Set("text", Napi::String::New(env, text));

        //         callback.Call({segment});
        //     });
        // };
        // params.new_segment_callback_user_data = this;

        int err = whisper_full_with_state(context, state, params, samples, n_samples);
        if (err != 0) {
            SetError("whisper_full operation failed");
        }
    }

    void OnOK() override {
        Napi::HandleScope scope(Env());

        int         n_segments = whisper_full_n_segments_from_state(state);
        Napi::Array segments = Napi::Array::New(Env(), n_segments);
        for (int i = 0; i < n_segments; i++) {
            Napi::Object segment = Napi::Object::New(Env());
            segment.Set("from", Napi::Number::New(
                                    Env(), whisper_full_get_segment_t0_from_state(state, i) * 10));
            segment.Set("to", Napi::Number::New(
                                  Env(), whisper_full_get_segment_t1_from_state(state, i) * 10));
            segment.Set("text", Napi::String::New(
                                    Env(), whisper_full_get_segment_text_from_state(state, i)));
            segments.Set(i, segment);
        }

        Callback().Call({segments});
    }

   private:
    whisper_context           *context;
    whisper_state             *state;
    const float               *samples;
    int                        n_samples;
    struct whisper_full_params params;
    // Napi::ThreadSafeFunction   tsfn;
};

Napi::Value Transcribe(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    if (info.Length() != 4) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    whisper_context *context = info[0].As<Napi::External<whisper_context>>().Data();

    Napi::Float32Array pcm = info[1].As<Napi::Float32Array>();
    float             *samples = new float[pcm.ElementLength()];
    memcpy(samples, pcm.Data(), pcm.ByteLength());

    int n_samples = static_cast<int>(pcm.ElementLength());

    Napi::Object               params = info[2].As<Napi::Object>();
    struct whisper_full_params whisper_params = whisper_full_params_from_js(params);

    Napi::Function finish_callback = info[3].As<Napi::Function>();

    TranscribeWorker *worker =
        new TranscribeWorker(context, samples, n_samples, whisper_params, finish_callback);
    worker->Queue();

    return env.Undefined();
}
