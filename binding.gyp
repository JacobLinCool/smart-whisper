{
  'variables' : {
    'openssl_fips': '',
  },
  "targets": [
    {
      "target_name": "smart-whisper",
      "sources": [
          "src/binding.cc",
          "src/binding/model.cc",
          "src/binding/transcribe.cc",
      ],
      "libraries": [ "<(module_root_dir)/whisper.cpp/libwhisper.a" ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "whisper.cpp", "whisper.cpp/examples"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },
      'conditions': [
        ['OS=="mac"', {
            'cflags+': ['-fvisibility=hidden'],
            'link_settings': {
                'libraries': [
                    '-framework CoreFoundation',
                    '-framework Foundation',
                    '-framework Metal',
                    '-framework MetalKit',
                ],
            },
            'xcode_settings': {
                'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES', # -fvisibility=hidden
            }
        }]
      ]
    }
  ],
}
