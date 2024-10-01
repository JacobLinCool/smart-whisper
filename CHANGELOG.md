# smart-whisper

## 0.8.0

### Minor Changes

- [#48](https://github.com/JacobLinCool/smart-whisper/pull/48) [`c5ab7f2`](https://github.com/JacobLinCool/smart-whisper/commit/c5ab7f28f494a046aeca4d90013c4570b7dab2ae) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Support large-v3-turbo, sync whisper.cpp to 2ef717b293fe93872cc3a03ca77942936a281959

- [#43](https://github.com/JacobLinCool/smart-whisper/pull/43) [`b898a98`](https://github.com/JacobLinCool/smart-whisper/commit/b898a989fd232979f1c3ac9b873b035e5fb3ad6e) Thanks [@silvioprog](https://github.com/silvioprog)! - Detected spoken language

## 0.7.0

### Minor Changes

- [#30](https://github.com/JacobLinCool/smart-whisper/pull/30) [`e6a6966`](https://github.com/JacobLinCool/smart-whisper/commit/e6a6966af62ecd046a82c6403a4777f3fe884efb) Thanks [@silvioprog](https://github.com/silvioprog)! - Add EN models

## 0.6.1

### Patch Changes

- [`9427207`](https://github.com/JacobLinCool/smart-whisper/commit/9427207a4714fc922832387280ea4f6e3338963e) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Add missing types in v0.6.0

## 0.6.0

### Minor Changes

- [#24](https://github.com/JacobLinCool/smart-whisper/pull/24) [`e26508e`](https://github.com/JacobLinCool/smart-whisper/commit/e26508e69ef625ea79efd18feab52bddbe11a60f) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - WhisperModel will now be automatically freed by the Node.js garbage collector if `.free()` has not been called previously.

### Patch Changes

- [#26](https://github.com/JacobLinCool/smart-whisper/pull/26) [`c03648c`](https://github.com/JacobLinCool/smart-whisper/commit/c03648c1ad853815bded3c5bf6d7d4821109df53) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Support all whisper.cpp transcribe params

- [#26](https://github.com/JacobLinCool/smart-whisper/pull/26) [`c03648c`](https://github.com/JacobLinCool/smart-whisper/commit/c03648c1ad853815bded3c5bf6d7d4821109df53) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Show token timestamps if available

## 0.5.0

### Minor Changes

- [#21](https://github.com/JacobLinCool/smart-whisper/pull/21) [`ebb91e7`](https://github.com/JacobLinCool/smart-whisper/commit/ebb91e76eaed44ed6bc1b9e57d222ad12c9da282) Thanks [@silvioprog](https://github.com/silvioprog)! - Allow to disable debug info in production

## 0.4.3

### Patch Changes

- [`917193c`](https://github.com/JacobLinCool/smart-whisper/commit/917193c2e8d823b5cd98280a8aa760f567cf76cc) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Add openblas auto-detection in build script

## 0.4.2

### Patch Changes

- [`953b397`](https://github.com/JacobLinCool/smart-whisper/commit/953b3979a5fd413244c6afd6f912d0686008618f) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Update upstream to 1cf679d

## 0.4.1

### Patch Changes

- [`f5f0ead`](https://github.com/JacobLinCool/smart-whisper/commit/f5f0ead97dff0bd8603138938c1dafafba6d8591) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Fix confidence algorithm

## 0.4.0

### Minor Changes

- [#14](https://github.com/JacobLinCool/smart-whisper/pull/14) [`9a21aaa`](https://github.com/JacobLinCool/smart-whisper/commit/9a21aaaed73be86a558c6ffa3f9ac15bbc08c26a) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Support BYOL (Bring your own library) for complex libwhisper.a / libwhisper.so usage

- [#14](https://github.com/JacobLinCool/smart-whisper/pull/14) [`9a21aaa`](https://github.com/JacobLinCool/smart-whisper/commit/9a21aaaed73be86a558c6ffa3f9ac15bbc08c26a) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Move all build process into gyp

## 0.3.0

### Minor Changes

- [`44009f5`](https://github.com/JacobLinCool/smart-whisper/commit/44009f509ea2fed5cacbf8585c16c0fad49e9f82) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Support "transcribed" event of TranscribeTask, which being emitted when partial transcription is available

### Patch Changes

- [`0b9c07b`](https://github.com/JacobLinCool/smart-whisper/commit/0b9c07b98a395a2a0ddb5e83bd81659500474b1d) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Update upstream commit to 6ebba52

## 0.2.0

### Minor Changes

- [`1a42992`](https://github.com/JacobLinCool/smart-whisper/commit/1a42992bca97111619b137a74392970987a9ee09) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Support detailed result format with confidence and token details

### Patch Changes

- [`4c12f41`](https://github.com/JacobLinCool/smart-whisper/commit/4c12f419cccb3b0e6ca80d5385b5c64540161241) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Add missing suppress_blank and suppress_none_speech_tokens params

## 0.1.2

### Patch Changes

- [`dbeaf9a`](https://github.com/JacobLinCool/smart-whisper/commit/dbeaf9a377a623614d67515accb6906817bf1143) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Includes script files in the package, 0.1.1 unintentionally ignores those scripts

## 0.1.1

### Patch Changes

- [`d7a5bfc`](https://github.com/JacobLinCool/smart-whisper/commit/d7a5bfcb9a102264aed0a814fd0d53e38cacd972) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Add library linker flags

## 0.1.0

### Minor Changes

- [`fe0c4c9`](https://github.com/JacobLinCool/smart-whisper/commit/fe0c4c9d5f0ce14e60e66436b5140c018c536c58) Thanks [@JacobLinCool](https://github.com/JacobLinCool)! - Set default ggml metal resources dir path
