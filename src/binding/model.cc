#include "model.h"

class LoadModelWorker : public Napi::AsyncWorker {
   public:
    LoadModelWorker(Napi::Function &callback, const std::string &model_path,
                    struct whisper_context_params params)
        : AsyncWorker(callback), model_path(model_path), params(params) {}

    void Execute() override {
        context = whisper_init_from_file_with_params_no_state(model_path.c_str(), params);
        if (context == nullptr) {
            SetError("Failed to initialize whisper context");
        }
        whisper_print_timings(context);
    }

    void OnOK() override {
        Napi::HandleScope               scope(Env());
        Napi::External<whisper_context> contextHandle =
            Napi::External<whisper_context>::New(Env(), context);
        Callback().Call({contextHandle});
    }

   private:
    std::string                   model_path;
    struct whisper_context_params params;
    whisper_context              *context;
};

bool IsProduction(const Napi::Object global_env) {
    Napi::Object process = global_env.Get("process").As<Napi::Object>();
    Napi::Object env = process.Get("env").As<Napi::Object>();
    Napi::Value  nodeEnv = env.Get("NODE_ENV");
    if (nodeEnv.IsString()) {
        Napi::String nodeEnvStr = nodeEnv.As<Napi::String>();
        std::string  envStr = nodeEnvStr.Utf8Value();
        return envStr == "production";
    }
    return false;
}

Napi::Value LoadModel(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    if (info.Length() != 3) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string model_path = info[0].As<Napi::String>();

    struct whisper_context_params params;
    params.use_gpu = info[1].As<Napi::Boolean>();

    Napi::Function callback = info[2].As<Napi::Function>();

    if (IsProduction(env.Global())) {
        whisper_log_set([](ggml_log_level level, const char *text, void *user_data) {}, nullptr);
    }

    LoadModelWorker *worker = new LoadModelWorker(callback, model_path, params);
    worker->Queue();

    return env.Undefined();
}

class FreeModelWorker : public Napi::AsyncWorker {
   public:
    FreeModelWorker(Napi::Function &callback, whisper_context *context)
        : AsyncWorker(callback), context(context) {}

    void Execute() override { whisper_free(context); }

    void OnOK() override {
        Napi::HandleScope scope(Env());
        Callback().Call({});
    }

   private:
    whisper_context *context;
};

Napi::Value FreeModel(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    if (info.Length() != 2) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    whisper_context *context = info[0].As<Napi::External<whisper_context>>().Data();

    Napi::Function callback = info[1].As<Napi::Function>();

    FreeModelWorker *worker = new FreeModelWorker(callback, context);
    worker->Queue();

    return env.Undefined();
}
