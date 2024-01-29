#include <napi.h>

#include "binding/model.h"
#include "binding/transcribe.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("transcribe", Napi::Function::New(env, Transcribe));
    WhisperModel::Init(env, exports);

    return exports;
}

NODE_API_MODULE(whisper, Init)
