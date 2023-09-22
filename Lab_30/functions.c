#include <emscripten/emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

	int EMSCRIPTEN_KEEPALIVE sum(int x, int y) { return x + y; }
	int EMSCRIPTEN_KEEPALIVE sub(int x, int y) { return x - y; }
	int EMSCRIPTEN_KEEPALIVE mul(int x, int y) { return x * y; }

#ifdef __cplusplus
}
#endif

//emcc functions.c -O3 -s WASM=1 -o functions.wasm