// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2020 ONDEWO GmbH
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.https://ondewo.slack.com/archives/CAWPP61NY
//
'use strict';
var grpc = require('@grpc/grpc-js');
var ondewo_s2t_speech$to$text_pb = require('../../ondewo/s2t/speech-to-text_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tDomainsRequest(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tDomainsRequest)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tDomainsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tDomainsRequest(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tDomainsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tDomainsResponse(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tDomainsResponse)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tDomainsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tDomainsResponse(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tDomainsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tLanguagesRequest(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tLanguagesRequest)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tLanguagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tLanguagesRequest(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tLanguagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tLanguagesResponse(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tLanguagesResponse)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tLanguagesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tLanguagesResponse(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tLanguagesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tPipelinesRequest(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tPipelinesRequest)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tPipelinesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tPipelinesRequest(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tPipelinesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_ListS2tPipelinesResponse(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.ListS2tPipelinesResponse)) {
    throw new Error('Expected argument of type ondewo.s2t.ListS2tPipelinesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_ListS2tPipelinesResponse(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.ListS2tPipelinesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_S2tPipelineId(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.S2tPipelineId)) {
    throw new Error('Expected argument of type ondewo.s2t.S2tPipelineId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_S2tPipelineId(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.S2tPipelineId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_Speech2TextConfig(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.Speech2TextConfig)) {
    throw new Error('Expected argument of type ondewo.s2t.Speech2TextConfig');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_Speech2TextConfig(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.Speech2TextConfig.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_TranscribeFileRequest(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.TranscribeFileRequest)) {
    throw new Error('Expected argument of type ondewo.s2t.TranscribeFileRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_TranscribeFileRequest(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.TranscribeFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_TranscribeFileResponse(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.TranscribeFileResponse)) {
    throw new Error('Expected argument of type ondewo.s2t.TranscribeFileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_TranscribeFileResponse(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.TranscribeFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_TranscribeStreamRequest(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.TranscribeStreamRequest)) {
    throw new Error('Expected argument of type ondewo.s2t.TranscribeStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_TranscribeStreamRequest(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.TranscribeStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ondewo_s2t_TranscribeStreamResponse(arg) {
  if (!(arg instanceof ondewo_s2t_speech$to$text_pb.TranscribeStreamResponse)) {
    throw new Error('Expected argument of type ondewo.s2t.TranscribeStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ondewo_s2t_TranscribeStreamResponse(buffer_arg) {
  return ondewo_s2t_speech$to$text_pb.TranscribeStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// endpoints of speech-to-text service
var Speech2TextService = exports.Speech2TextService = {
  transcribeFile: {
    path: '/ondewo.s2t.Speech2Text/TranscribeFile',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.TranscribeFileRequest,
    responseType: ondewo_s2t_speech$to$text_pb.TranscribeFileResponse,
    requestSerialize: serialize_ondewo_s2t_TranscribeFileRequest,
    requestDeserialize: deserialize_ondewo_s2t_TranscribeFileRequest,
    responseSerialize: serialize_ondewo_s2t_TranscribeFileResponse,
    responseDeserialize: deserialize_ondewo_s2t_TranscribeFileResponse,
  },
  transcribeStream: {
    path: '/ondewo.s2t.Speech2Text/TranscribeStream',
    requestStream: true,
    responseStream: true,
    requestType: ondewo_s2t_speech$to$text_pb.TranscribeStreamRequest,
    responseType: ondewo_s2t_speech$to$text_pb.TranscribeStreamResponse,
    requestSerialize: serialize_ondewo_s2t_TranscribeStreamRequest,
    requestDeserialize: deserialize_ondewo_s2t_TranscribeStreamRequest,
    responseSerialize: serialize_ondewo_s2t_TranscribeStreamResponse,
    responseDeserialize: deserialize_ondewo_s2t_TranscribeStreamResponse,
  },
  getS2tPipeline: {
    path: '/ondewo.s2t.Speech2Text/GetS2tPipeline',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.S2tPipelineId,
    responseType: ondewo_s2t_speech$to$text_pb.Speech2TextConfig,
    requestSerialize: serialize_ondewo_s2t_S2tPipelineId,
    requestDeserialize: deserialize_ondewo_s2t_S2tPipelineId,
    responseSerialize: serialize_ondewo_s2t_Speech2TextConfig,
    responseDeserialize: deserialize_ondewo_s2t_Speech2TextConfig,
  },
  createS2tPipeline: {
    path: '/ondewo.s2t.Speech2Text/CreateS2tPipeline',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.Speech2TextConfig,
    responseType: ondewo_s2t_speech$to$text_pb.S2tPipelineId,
    requestSerialize: serialize_ondewo_s2t_Speech2TextConfig,
    requestDeserialize: deserialize_ondewo_s2t_Speech2TextConfig,
    responseSerialize: serialize_ondewo_s2t_S2tPipelineId,
    responseDeserialize: deserialize_ondewo_s2t_S2tPipelineId,
  },
  deleteS2tPipeline: {
    path: '/ondewo.s2t.Speech2Text/DeleteS2tPipeline',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.S2tPipelineId,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ondewo_s2t_S2tPipelineId,
    requestDeserialize: deserialize_ondewo_s2t_S2tPipelineId,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateS2tPipeline: {
    path: '/ondewo.s2t.Speech2Text/UpdateS2tPipeline',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.Speech2TextConfig,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ondewo_s2t_Speech2TextConfig,
    requestDeserialize: deserialize_ondewo_s2t_Speech2TextConfig,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  listS2tPipelines: {
    path: '/ondewo.s2t.Speech2Text/ListS2tPipelines',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.ListS2tPipelinesRequest,
    responseType: ondewo_s2t_speech$to$text_pb.ListS2tPipelinesResponse,
    requestSerialize: serialize_ondewo_s2t_ListS2tPipelinesRequest,
    requestDeserialize: deserialize_ondewo_s2t_ListS2tPipelinesRequest,
    responseSerialize: serialize_ondewo_s2t_ListS2tPipelinesResponse,
    responseDeserialize: deserialize_ondewo_s2t_ListS2tPipelinesResponse,
  },
  listS2tLanguages: {
    path: '/ondewo.s2t.Speech2Text/ListS2tLanguages',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.ListS2tLanguagesRequest,
    responseType: ondewo_s2t_speech$to$text_pb.ListS2tLanguagesResponse,
    requestSerialize: serialize_ondewo_s2t_ListS2tLanguagesRequest,
    requestDeserialize: deserialize_ondewo_s2t_ListS2tLanguagesRequest,
    responseSerialize: serialize_ondewo_s2t_ListS2tLanguagesResponse,
    responseDeserialize: deserialize_ondewo_s2t_ListS2tLanguagesResponse,
  },
  listS2tDomains: {
    path: '/ondewo.s2t.Speech2Text/ListS2tDomains',
    requestStream: false,
    responseStream: false,
    requestType: ondewo_s2t_speech$to$text_pb.ListS2tDomainsRequest,
    responseType: ondewo_s2t_speech$to$text_pb.ListS2tDomainsResponse,
    requestSerialize: serialize_ondewo_s2t_ListS2tDomainsRequest,
    requestDeserialize: deserialize_ondewo_s2t_ListS2tDomainsRequest,
    responseSerialize: serialize_ondewo_s2t_ListS2tDomainsResponse,
    responseDeserialize: deserialize_ondewo_s2t_ListS2tDomainsResponse,
  },
};

exports.Speech2TextClient = grpc.makeGenericClientConstructor(Speech2TextService);
