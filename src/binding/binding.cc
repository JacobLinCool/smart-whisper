#include <napi.h>

#include "model.h"
#include "transcribe.h"

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("transcribe", Napi::Function::New(env, Transcribe));
    WhisperModel::Init(env, exports);

    return exports;
}

NODE_API_MODULE(whisper, Init)
