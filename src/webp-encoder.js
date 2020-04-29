const webp = WebP();

class WebPEncoder {
  
  encode(image, quality, callback) {
    webp.then(function(Module) {
      const api = {
        version: Module.cwrap('version', 'number', []),
        create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
        encode: Module.cwrap('encode', '', ['number', 'number', 'number', 'number']),
        get_result_pointer: Module.cwrap('get_result_pointer', 'number', ''),
        get_result_size: Module.cwrap('get_result_size', 'number', ''),
        free_result: Module.cwrap('free_result', '', ['number']),
      };

      const p = api.create_buffer(image.width, image.height);
      
      Module.HEAP8.set(image.data, p);
      
      api.encode(p, image.width, image.height, quality);
      
      const resultPointer = api.get_result_pointer();
      const resultSize = api.get_result_size();
      const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
      const result = new Uint8Array(resultView);
      
      api.free_result(resultPointer);
      api.destroy_buffer(p);

      callback(result);
    });
  }
}