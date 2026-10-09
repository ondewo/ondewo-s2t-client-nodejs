'use strict';
function reexport(m) {
  Object.keys(m).forEach(function (k) {
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) {
      Object.defineProperty(exports, k, { enumerable: true, get: function () { return m[k]; } });
    }
  });
}
reexport(require('./api/google/protobuf/empty_grpc_pb'));
reexport(require('./api/google/protobuf/empty_pb'));
reexport(require('./api/google/protobuf/struct_grpc_pb'));
reexport(require('./api/google/protobuf/struct_pb'));
reexport(require('./api/ondewo/s2t/speech-to-text_grpc_pb'));
reexport(require('./api/ondewo/s2t/speech-to-text_pb'));
reexport(require('./auth/grpcChannel'));
reexport(require('./auth/offlineTokenProvider'));
