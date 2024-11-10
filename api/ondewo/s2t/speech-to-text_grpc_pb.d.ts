// package: ondewo.s2t
// file: ondewo/s2t/speech-to-text.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as ondewo_s2t_speech_to_text_pb from "../../ondewo/s2t/speech-to-text_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_struct_pb from "google-protobuf/google/protobuf/struct_pb";

interface ISpeech2TextService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    transcribeFile: ISpeech2TextService_ITranscribeFile;
    transcribeStream: ISpeech2TextService_ITranscribeStream;
    getS2tPipeline: ISpeech2TextService_IGetS2tPipeline;
    createS2tPipeline: ISpeech2TextService_ICreateS2tPipeline;
    deleteS2tPipeline: ISpeech2TextService_IDeleteS2tPipeline;
    updateS2tPipeline: ISpeech2TextService_IUpdateS2tPipeline;
    listS2tPipelines: ISpeech2TextService_IListS2tPipelines;
    listS2tLanguages: ISpeech2TextService_IListS2tLanguages;
    listS2tDomains: ISpeech2TextService_IListS2tDomains;
    getServiceInfo: ISpeech2TextService_IGetServiceInfo;
    listS2tLanguageModels: ISpeech2TextService_IListS2tLanguageModels;
    createUserLanguageModel: ISpeech2TextService_ICreateUserLanguageModel;
    deleteUserLanguageModel: ISpeech2TextService_IDeleteUserLanguageModel;
    addDataToUserLanguageModel: ISpeech2TextService_IAddDataToUserLanguageModel;
    trainUserLanguageModel: ISpeech2TextService_ITrainUserLanguageModel;
}

interface ISpeech2TextService_ITranscribeFile extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, ondewo_s2t_speech_to_text_pb.TranscribeFileResponse> {
    path: "/ondewo.s2t.Speech2Text/TranscribeFile";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.TranscribeFileRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.TranscribeFileRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.TranscribeFileResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.TranscribeFileResponse>;
}
interface ISpeech2TextService_ITranscribeStream extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse> {
    path: "/ondewo.s2t.Speech2Text/TranscribeStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
}
interface ISpeech2TextService_IGetS2tPipeline extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.S2tPipelineId, ondewo_s2t_speech_to_text_pb.Speech2TextConfig> {
    path: "/ondewo.s2t.Speech2Text/GetS2tPipeline";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
}
interface ISpeech2TextService_ICreateS2tPipeline extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.Speech2TextConfig, ondewo_s2t_speech_to_text_pb.S2tPipelineId> {
    path: "/ondewo.s2t.Speech2Text/CreateS2tPipeline";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
}
interface ISpeech2TextService_IDeleteS2tPipeline extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.S2tPipelineId, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/DeleteS2tPipeline";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISpeech2TextService_IUpdateS2tPipeline extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.Speech2TextConfig, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/UpdateS2tPipeline";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISpeech2TextService_IListS2tPipelines extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse> {
    path: "/ondewo.s2t.Speech2Text/ListS2tPipelines";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse>;
}
interface ISpeech2TextService_IListS2tLanguages extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse> {
    path: "/ondewo.s2t.Speech2Text/ListS2tLanguages";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse>;
}
interface ISpeech2TextService_IListS2tDomains extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse> {
    path: "/ondewo.s2t.Speech2Text/ListS2tDomains";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse>;
}
interface ISpeech2TextService_IGetServiceInfo extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse> {
    path: "/ondewo.s2t.Speech2Text/GetServiceInfo";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse>;
}
interface ISpeech2TextService_IListS2tLanguageModels extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse> {
    path: "/ondewo.s2t.Speech2Text/ListS2tLanguageModels";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest>;
    responseSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse>;
    responseDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse>;
}
interface ISpeech2TextService_ICreateUserLanguageModel extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/CreateUserLanguageModel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISpeech2TextService_IDeleteUserLanguageModel extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/DeleteUserLanguageModel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISpeech2TextService_IAddDataToUserLanguageModel extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/AddDataToUserLanguageModel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ISpeech2TextService_ITrainUserLanguageModel extends grpc.MethodDefinition<ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, google_protobuf_empty_pb.Empty> {
    path: "/ondewo.s2t.Speech2Text/TrainUserLanguageModel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest>;
    requestDeserialize: grpc.deserialize<ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const Speech2TextService: ISpeech2TextService;

export interface ISpeech2TextServer {
    transcribeFile: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, ondewo_s2t_speech_to_text_pb.TranscribeFileResponse>;
    transcribeStream: grpc.handleBidiStreamingCall<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    getS2tPipeline: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.S2tPipelineId, ondewo_s2t_speech_to_text_pb.Speech2TextConfig>;
    createS2tPipeline: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.Speech2TextConfig, ondewo_s2t_speech_to_text_pb.S2tPipelineId>;
    deleteS2tPipeline: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.S2tPipelineId, google_protobuf_empty_pb.Empty>;
    updateS2tPipeline: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.Speech2TextConfig, google_protobuf_empty_pb.Empty>;
    listS2tPipelines: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse>;
    listS2tLanguages: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse>;
    listS2tDomains: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse>;
    getServiceInfo: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse>;
    listS2tLanguageModels: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse>;
    createUserLanguageModel: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, google_protobuf_empty_pb.Empty>;
    deleteUserLanguageModel: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, google_protobuf_empty_pb.Empty>;
    addDataToUserLanguageModel: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, google_protobuf_empty_pb.Empty>;
    trainUserLanguageModel: grpc.handleUnaryCall<ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, google_protobuf_empty_pb.Empty>;
}

export interface ISpeech2TextClient {
    transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    transcribeStream(): grpc.ClientDuplexStream<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    transcribeStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    transcribeStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    getServiceInfo(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    getServiceInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    getServiceInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class Speech2TextClient extends grpc.Client implements ISpeech2TextClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    public transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    public transcribeFile(request: ondewo_s2t_speech_to_text_pb.TranscribeFileRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.TranscribeFileResponse) => void): grpc.ClientUnaryCall;
    public transcribeStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    public transcribeStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<ondewo_s2t_speech_to_text_pb.TranscribeStreamRequest, ondewo_s2t_speech_to_text_pb.TranscribeStreamResponse>;
    public getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    public getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    public getS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.Speech2TextConfig) => void): grpc.ClientUnaryCall;
    public createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    public createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    public createS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2tPipelineId) => void): grpc.ClientUnaryCall;
    public deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteS2tPipeline(request: ondewo_s2t_speech_to_text_pb.S2tPipelineId, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateS2tPipeline(request: ondewo_s2t_speech_to_text_pb.Speech2TextConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    public listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    public listS2tPipelines(request: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tPipelinesResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguages(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguagesResponse) => void): grpc.ClientUnaryCall;
    public listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    public listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    public listS2tDomains(request: ondewo_s2t_speech_to_text_pb.ListS2tDomainsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tDomainsResponse) => void): grpc.ClientUnaryCall;
    public getServiceInfo(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    public getServiceInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    public getServiceInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.S2TGetServiceInfoResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    public listS2tLanguageModels(request: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ondewo_s2t_speech_to_text_pb.ListS2tLanguageModelsResponse) => void): grpc.ClientUnaryCall;
    public createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.CreateUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.DeleteUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addDataToUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.AddDataToUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public trainUserLanguageModel(request: ondewo_s2t_speech_to_text_pb.TrainUserLanguageModelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
