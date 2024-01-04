#include <napi.h>

#include "binding/model.h"
#include "binding/transcribe.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("load", Napi::Function::New(env, LoadModel));
    exports.Set("free", Napi::Function::New(env, FreeModel));
    exports.Set("transcribe", Napi::Function::New(env, Transcribe));

    return exports;
}

NODE_API_MODULE(whisper, Init)
