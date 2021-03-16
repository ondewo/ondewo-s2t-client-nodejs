// package: ondewo.s2t
// file: ondewo/s2t/speech-to-text.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class TranscribeStreamRequest extends jspb.Message { 
    getS2tPipelineId(): string;
    setS2tPipelineId(value: string): TranscribeStreamRequest;
    getAudioChunk(): Uint8Array | string;
    getAudioChunk_asU8(): Uint8Array;
    getAudioChunk_asB64(): string;
    setAudioChunk(value: Uint8Array | string): TranscribeStreamRequest;
    getCtcDecoding(): CTCDecoding;
    setCtcDecoding(value: CTCDecoding): TranscribeStreamRequest;
    getSpellingCorrection(): boolean;
    setSpellingCorrection(value: boolean): TranscribeStreamRequest;
    getEndOfStream(): boolean;
    setEndOfStream(value: boolean): TranscribeStreamRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TranscribeStreamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TranscribeStreamRequest): TranscribeStreamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TranscribeStreamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TranscribeStreamRequest;
    static deserializeBinaryFromReader(message: TranscribeStreamRequest, reader: jspb.BinaryReader): TranscribeStreamRequest;
}

export namespace TranscribeStreamRequest {
    export type AsObject = {
        s2tPipelineId: string,
        audioChunk: Uint8Array | string,
        ctcDecoding: CTCDecoding,
        spellingCorrection: boolean,
        endOfStream: boolean,
    }
}

export class TranscribeStreamResponse extends jspb.Message { 
    getTranscription(): string;
    setTranscription(value: string): TranscribeStreamResponse;
    getTime(): number;
    setTime(value: number): TranscribeStreamResponse;
    getFinal(): boolean;
    setFinal(value: boolean): TranscribeStreamResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TranscribeStreamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TranscribeStreamResponse): TranscribeStreamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TranscribeStreamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TranscribeStreamResponse;
    static deserializeBinaryFromReader(message: TranscribeStreamResponse, reader: jspb.BinaryReader): TranscribeStreamResponse;
}

export namespace TranscribeStreamResponse {
    export type AsObject = {
        transcription: string,
        time: number,
        pb_final: boolean,
    }
}

export class TranscribeFileRequest extends jspb.Message { 
    getS2tPipelineId(): string;
    setS2tPipelineId(value: string): TranscribeFileRequest;
    getAudioFile(): Uint8Array | string;
    getAudioFile_asU8(): Uint8Array;
    getAudioFile_asB64(): string;
    setAudioFile(value: Uint8Array | string): TranscribeFileRequest;
    getCtcDecoding(): CTCDecoding;
    setCtcDecoding(value: CTCDecoding): TranscribeFileRequest;
    getSpellingCorrection(): boolean;
    setSpellingCorrection(value: boolean): TranscribeFileRequest;
    getIncludeTiming(): boolean;
    setIncludeTiming(value: boolean): TranscribeFileRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TranscribeFileRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TranscribeFileRequest): TranscribeFileRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TranscribeFileRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TranscribeFileRequest;
    static deserializeBinaryFromReader(message: TranscribeFileRequest, reader: jspb.BinaryReader): TranscribeFileRequest;
}

export namespace TranscribeFileRequest {
    export type AsObject = {
        s2tPipelineId: string,
        audioFile: Uint8Array | string,
        ctcDecoding: CTCDecoding,
        spellingCorrection: boolean,
        includeTiming: boolean,
    }
}

export class TranscribeFileResponse extends jspb.Message { 
    getTranscription(): string;
    setTranscription(value: string): TranscribeFileResponse;
    getTime(): number;
    setTime(value: number): TranscribeFileResponse;
    clearWordTimingList(): void;
    getWordTimingList(): Array<WordTiming>;
    setWordTimingList(value: Array<WordTiming>): TranscribeFileResponse;
    addWordTiming(value?: WordTiming, index?: number): WordTiming;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TranscribeFileResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TranscribeFileResponse): TranscribeFileResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TranscribeFileResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TranscribeFileResponse;
    static deserializeBinaryFromReader(message: TranscribeFileResponse, reader: jspb.BinaryReader): TranscribeFileResponse;
}

export namespace TranscribeFileResponse {
    export type AsObject = {
        transcription: string,
        time: number,
        wordTimingList: Array<WordTiming.AsObject>,
    }
}

export class WordTiming extends jspb.Message { 
    getWord(): string;
    setWord(value: string): WordTiming;
    getBegin(): number;
    setBegin(value: number): WordTiming;
    getEnd(): number;
    setEnd(value: number): WordTiming;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WordTiming.AsObject;
    static toObject(includeInstance: boolean, msg: WordTiming): WordTiming.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: WordTiming, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WordTiming;
    static deserializeBinaryFromReader(message: WordTiming, reader: jspb.BinaryReader): WordTiming;
}

export namespace WordTiming {
    export type AsObject = {
        word: string,
        begin: number,
        end: number,
    }
}

export class S2tPipelineId extends jspb.Message { 
    getId(): string;
    setId(value: string): S2tPipelineId;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): S2tPipelineId.AsObject;
    static toObject(includeInstance: boolean, msg: S2tPipelineId): S2tPipelineId.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: S2tPipelineId, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): S2tPipelineId;
    static deserializeBinaryFromReader(message: S2tPipelineId, reader: jspb.BinaryReader): S2tPipelineId;
}

export namespace S2tPipelineId {
    export type AsObject = {
        id: string,
    }
}

export class ListS2tPipelinesRequest extends jspb.Message { 
    clearLanguagesList(): void;
    getLanguagesList(): Array<string>;
    setLanguagesList(value: Array<string>): ListS2tPipelinesRequest;
    addLanguages(value: string, index?: number): string;
    clearPipelineOwnersList(): void;
    getPipelineOwnersList(): Array<string>;
    setPipelineOwnersList(value: Array<string>): ListS2tPipelinesRequest;
    addPipelineOwners(value: string, index?: number): string;
    clearDomainsList(): void;
    getDomainsList(): Array<string>;
    setDomainsList(value: Array<string>): ListS2tPipelinesRequest;
    addDomains(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tPipelinesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tPipelinesRequest): ListS2tPipelinesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tPipelinesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tPipelinesRequest;
    static deserializeBinaryFromReader(message: ListS2tPipelinesRequest, reader: jspb.BinaryReader): ListS2tPipelinesRequest;
}

export namespace ListS2tPipelinesRequest {
    export type AsObject = {
        languagesList: Array<string>,
        pipelineOwnersList: Array<string>,
        domainsList: Array<string>,
    }
}

export class ListS2tPipelinesResponse extends jspb.Message { 
    clearPipelineConfigsList(): void;
    getPipelineConfigsList(): Array<Speech2TextConfig>;
    setPipelineConfigsList(value: Array<Speech2TextConfig>): ListS2tPipelinesResponse;
    addPipelineConfigs(value?: Speech2TextConfig, index?: number): Speech2TextConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tPipelinesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tPipelinesResponse): ListS2tPipelinesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tPipelinesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tPipelinesResponse;
    static deserializeBinaryFromReader(message: ListS2tPipelinesResponse, reader: jspb.BinaryReader): ListS2tPipelinesResponse;
}

export namespace ListS2tPipelinesResponse {
    export type AsObject = {
        pipelineConfigsList: Array<Speech2TextConfig.AsObject>,
    }
}

export class ListS2tLanguagesRequest extends jspb.Message { 
    clearDomainsList(): void;
    getDomainsList(): Array<string>;
    setDomainsList(value: Array<string>): ListS2tLanguagesRequest;
    addDomains(value: string, index?: number): string;
    clearPipelineOwnersList(): void;
    getPipelineOwnersList(): Array<string>;
    setPipelineOwnersList(value: Array<string>): ListS2tLanguagesRequest;
    addPipelineOwners(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tLanguagesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tLanguagesRequest): ListS2tLanguagesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tLanguagesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tLanguagesRequest;
    static deserializeBinaryFromReader(message: ListS2tLanguagesRequest, reader: jspb.BinaryReader): ListS2tLanguagesRequest;
}

export namespace ListS2tLanguagesRequest {
    export type AsObject = {
        domainsList: Array<string>,
        pipelineOwnersList: Array<string>,
    }
}

export class ListS2tLanguagesResponse extends jspb.Message { 
    clearLanguagesList(): void;
    getLanguagesList(): Array<string>;
    setLanguagesList(value: Array<string>): ListS2tLanguagesResponse;
    addLanguages(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tLanguagesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tLanguagesResponse): ListS2tLanguagesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tLanguagesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tLanguagesResponse;
    static deserializeBinaryFromReader(message: ListS2tLanguagesResponse, reader: jspb.BinaryReader): ListS2tLanguagesResponse;
}

export namespace ListS2tLanguagesResponse {
    export type AsObject = {
        languagesList: Array<string>,
    }
}

export class ListS2tDomainsRequest extends jspb.Message { 
    clearLanguagesList(): void;
    getLanguagesList(): Array<string>;
    setLanguagesList(value: Array<string>): ListS2tDomainsRequest;
    addLanguages(value: string, index?: number): string;
    clearPipelineOwnersList(): void;
    getPipelineOwnersList(): Array<string>;
    setPipelineOwnersList(value: Array<string>): ListS2tDomainsRequest;
    addPipelineOwners(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tDomainsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tDomainsRequest): ListS2tDomainsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tDomainsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tDomainsRequest;
    static deserializeBinaryFromReader(message: ListS2tDomainsRequest, reader: jspb.BinaryReader): ListS2tDomainsRequest;
}

export namespace ListS2tDomainsRequest {
    export type AsObject = {
        languagesList: Array<string>,
        pipelineOwnersList: Array<string>,
    }
}

export class ListS2tDomainsResponse extends jspb.Message { 
    clearDomainsList(): void;
    getDomainsList(): Array<string>;
    setDomainsList(value: Array<string>): ListS2tDomainsResponse;
    addDomains(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListS2tDomainsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListS2tDomainsResponse): ListS2tDomainsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListS2tDomainsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListS2tDomainsResponse;
    static deserializeBinaryFromReader(message: ListS2tDomainsResponse, reader: jspb.BinaryReader): ListS2tDomainsResponse;
}

export namespace ListS2tDomainsResponse {
    export type AsObject = {
        domainsList: Array<string>,
    }
}

export class Speech2TextConfig extends jspb.Message { 
    getId(): string;
    setId(value: string): Speech2TextConfig;

    hasDescription(): boolean;
    clearDescription(): void;
    getDescription(): Description | undefined;
    setDescription(value?: Description): Speech2TextConfig;
    getActive(): boolean;
    setActive(value: boolean): Speech2TextConfig;

    hasInference(): boolean;
    clearInference(): void;
    getInference(): Inference | undefined;
    setInference(value?: Inference): Speech2TextConfig;

    hasStreamingServer(): boolean;
    clearStreamingServer(): void;
    getStreamingServer(): StreamingServer | undefined;
    setStreamingServer(value?: StreamingServer): Speech2TextConfig;

    hasVoiceActivityDetection(): boolean;
    clearVoiceActivityDetection(): void;
    getVoiceActivityDetection(): VoiceActivityDetection | undefined;
    setVoiceActivityDetection(value?: VoiceActivityDetection): Speech2TextConfig;

    hasPostProcessing(): boolean;
    clearPostProcessing(): void;
    getPostProcessing(): PostProcessing | undefined;
    setPostProcessing(value?: PostProcessing): Speech2TextConfig;

    hasLogging(): boolean;
    clearLogging(): void;
    getLogging(): Logging | undefined;
    setLogging(value?: Logging): Speech2TextConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Speech2TextConfig.AsObject;
    static toObject(includeInstance: boolean, msg: Speech2TextConfig): Speech2TextConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Speech2TextConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Speech2TextConfig;
    static deserializeBinaryFromReader(message: Speech2TextConfig, reader: jspb.BinaryReader): Speech2TextConfig;
}

export namespace Speech2TextConfig {
    export type AsObject = {
        id: string,
        description?: Description.AsObject,
        active: boolean,
        inference?: Inference.AsObject,
        streamingServer?: StreamingServer.AsObject,
        voiceActivityDetection?: VoiceActivityDetection.AsObject,
        postProcessing?: PostProcessing.AsObject,
        logging?: Logging.AsObject,
    }
}

export class Description extends jspb.Message { 
    getLanguage(): string;
    setLanguage(value: string): Description;
    getPipelineOwner(): string;
    setPipelineOwner(value: string): Description;
    getDomain(): string;
    setDomain(value: string): Description;
    getComments(): string;
    setComments(value: string): Description;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Description.AsObject;
    static toObject(includeInstance: boolean, msg: Description): Description.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Description, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Description;
    static deserializeBinaryFromReader(message: Description, reader: jspb.BinaryReader): Description;
}

export namespace Description {
    export type AsObject = {
        language: string,
        pipelineOwner: string,
        domain: string,
        comments: string,
    }
}

export class Inference extends jspb.Message { 

    hasCtcAcousticModels(): boolean;
    clearCtcAcousticModels(): void;
    getCtcAcousticModels(): CtcAcousticModels | undefined;
    setCtcAcousticModels(value?: CtcAcousticModels): Inference;

    hasLanguageModel(): boolean;
    clearLanguageModel(): void;
    getLanguageModel(): LanguageModel | undefined;
    setLanguageModel(value?: LanguageModel): Inference;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Inference.AsObject;
    static toObject(includeInstance: boolean, msg: Inference): Inference.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Inference, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Inference;
    static deserializeBinaryFromReader(message: Inference, reader: jspb.BinaryReader): Inference;
}

export namespace Inference {
    export type AsObject = {
        ctcAcousticModels?: CtcAcousticModels.AsObject,
        languageModel?: LanguageModel.AsObject,
    }
}

export class CtcAcousticModels extends jspb.Message { 
    getType(): string;
    setType(value: string): CtcAcousticModels;

    hasQuartznet(): boolean;
    clearQuartznet(): void;
    getQuartznet(): Quartznet | undefined;
    setQuartznet(value?: Quartznet): CtcAcousticModels;

    hasQuartznetTriton(): boolean;
    clearQuartznetTriton(): void;
    getQuartznetTriton(): QuartznetTriton | undefined;
    setQuartznetTriton(value?: QuartznetTriton): CtcAcousticModels;

    hasWav2vec(): boolean;
    clearWav2vec(): void;
    getWav2vec(): Wav2Vec | undefined;
    setWav2vec(value?: Wav2Vec): CtcAcousticModels;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CtcAcousticModels.AsObject;
    static toObject(includeInstance: boolean, msg: CtcAcousticModels): CtcAcousticModels.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CtcAcousticModels, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CtcAcousticModels;
    static deserializeBinaryFromReader(message: CtcAcousticModels, reader: jspb.BinaryReader): CtcAcousticModels;
}

export namespace CtcAcousticModels {
    export type AsObject = {
        type: string,
        quartznet?: Quartznet.AsObject,
        quartznetTriton?: QuartznetTriton.AsObject,
        wav2vec?: Wav2Vec.AsObject,
    }
}

export class Wav2Vec extends jspb.Message { 
    getModelPath(): string;
    setModelPath(value: string): Wav2Vec;
    getUseGpu(): boolean;
    setUseGpu(value: boolean): Wav2Vec;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Wav2Vec.AsObject;
    static toObject(includeInstance: boolean, msg: Wav2Vec): Wav2Vec.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Wav2Vec, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Wav2Vec;
    static deserializeBinaryFromReader(message: Wav2Vec, reader: jspb.BinaryReader): Wav2Vec;
}

export namespace Wav2Vec {
    export type AsObject = {
        modelPath: string,
        useGpu: boolean,
    }
}

export class Quartznet extends jspb.Message { 
    getConfigPath(): string;
    setConfigPath(value: string): Quartznet;
    getLoadType(): string;
    setLoadType(value: string): Quartznet;

    hasPtFiles(): boolean;
    clearPtFiles(): void;
    getPtFiles(): PtFiles | undefined;
    setPtFiles(value?: PtFiles): Quartznet;

    hasCkptFile(): boolean;
    clearCkptFile(): void;
    getCkptFile(): CkptFile | undefined;
    setCkptFile(value?: CkptFile): Quartznet;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Quartznet.AsObject;
    static toObject(includeInstance: boolean, msg: Quartznet): Quartznet.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Quartznet, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Quartznet;
    static deserializeBinaryFromReader(message: Quartznet, reader: jspb.BinaryReader): Quartznet;
}

export namespace Quartznet {
    export type AsObject = {
        configPath: string,
        loadType: string,
        ptFiles?: PtFiles.AsObject,
        ckptFile?: CkptFile.AsObject,
    }
}

export class PtFiles extends jspb.Message { 
    getPath(): string;
    setPath(value: string): PtFiles;
    getStep(): string;
    setStep(value: string): PtFiles;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PtFiles.AsObject;
    static toObject(includeInstance: boolean, msg: PtFiles): PtFiles.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PtFiles, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PtFiles;
    static deserializeBinaryFromReader(message: PtFiles, reader: jspb.BinaryReader): PtFiles;
}

export namespace PtFiles {
    export type AsObject = {
        path: string,
        step: string,
    }
}

export class CkptFile extends jspb.Message { 
    getPath(): string;
    setPath(value: string): CkptFile;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CkptFile.AsObject;
    static toObject(includeInstance: boolean, msg: CkptFile): CkptFile.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CkptFile, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CkptFile;
    static deserializeBinaryFromReader(message: CkptFile, reader: jspb.BinaryReader): CkptFile;
}

export namespace CkptFile {
    export type AsObject = {
        path: string,
    }
}

export class QuartznetTriton extends jspb.Message { 
    getConfigPath(): string;
    setConfigPath(value: string): QuartznetTriton;
    getTritonUrl(): string;
    setTritonUrl(value: string): QuartznetTriton;
    getTritonModel(): string;
    setTritonModel(value: string): QuartznetTriton;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QuartznetTriton.AsObject;
    static toObject(includeInstance: boolean, msg: QuartznetTriton): QuartznetTriton.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QuartznetTriton, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QuartznetTriton;
    static deserializeBinaryFromReader(message: QuartznetTriton, reader: jspb.BinaryReader): QuartznetTriton;
}

export namespace QuartznetTriton {
    export type AsObject = {
        configPath: string,
        tritonUrl: string,
        tritonModel: string,
    }
}

export class LanguageModel extends jspb.Message { 
    getPath(): string;
    setPath(value: string): LanguageModel;
    getBeamSize(): number;
    setBeamSize(value: number): LanguageModel;
    getBeamSearchScorerAlpha(): number;
    setBeamSearchScorerAlpha(value: number): LanguageModel;
    getBeamSearchScorerBeta(): number;
    setBeamSearchScorerBeta(value: number): LanguageModel;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LanguageModel.AsObject;
    static toObject(includeInstance: boolean, msg: LanguageModel): LanguageModel.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LanguageModel, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LanguageModel;
    static deserializeBinaryFromReader(message: LanguageModel, reader: jspb.BinaryReader): LanguageModel;
}

export namespace LanguageModel {
    export type AsObject = {
        path: string,
        beamSize: number,
        beamSearchScorerAlpha: number,
        beamSearchScorerBeta: number,
    }
}

export class StreamingServer extends jspb.Message { 
    getHost(): string;
    setHost(value: string): StreamingServer;
    getPort(): number;
    setPort(value: number): StreamingServer;
    getOutputStyle(): string;
    setOutputStyle(value: string): StreamingServer;

    hasStreamingSpeechRecognition(): boolean;
    clearStreamingSpeechRecognition(): void;
    getStreamingSpeechRecognition(): StreamingSpeechRecognition | undefined;
    setStreamingSpeechRecognition(value?: StreamingSpeechRecognition): StreamingServer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamingServer.AsObject;
    static toObject(includeInstance: boolean, msg: StreamingServer): StreamingServer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamingServer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamingServer;
    static deserializeBinaryFromReader(message: StreamingServer, reader: jspb.BinaryReader): StreamingServer;
}

export namespace StreamingServer {
    export type AsObject = {
        host: string,
        port: number,
        outputStyle: string,
        streamingSpeechRecognition?: StreamingSpeechRecognition.AsObject,
    }
}

export class StreamingSpeechRecognition extends jspb.Message { 
    getTranscribeNotFinal(): boolean;
    setTranscribeNotFinal(value: boolean): StreamingSpeechRecognition;
    getCtcDecodingMethod(): string;
    setCtcDecodingMethod(value: string): StreamingSpeechRecognition;
    getSamplingRate(): number;
    setSamplingRate(value: number): StreamingSpeechRecognition;
    getMinAudioChunkSize(): number;
    setMinAudioChunkSize(value: number): StreamingSpeechRecognition;
    getStartOfUtteranceThreshold(): number;
    setStartOfUtteranceThreshold(value: number): StreamingSpeechRecognition;
    getEndOfUtteranceThreshold(): number;
    setEndOfUtteranceThreshold(value: number): StreamingSpeechRecognition;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamingSpeechRecognition.AsObject;
    static toObject(includeInstance: boolean, msg: StreamingSpeechRecognition): StreamingSpeechRecognition.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamingSpeechRecognition, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamingSpeechRecognition;
    static deserializeBinaryFromReader(message: StreamingSpeechRecognition, reader: jspb.BinaryReader): StreamingSpeechRecognition;
}

export namespace StreamingSpeechRecognition {
    export type AsObject = {
        transcribeNotFinal: boolean,
        ctcDecodingMethod: string,
        samplingRate: number,
        minAudioChunkSize: number,
        startOfUtteranceThreshold: number,
        endOfUtteranceThreshold: number,
    }
}

export class VoiceActivityDetection extends jspb.Message { 
    getActive(): string;
    setActive(value: string): VoiceActivityDetection;
    getSamplingRate(): number;
    setSamplingRate(value: number): VoiceActivityDetection;

    hasPyannote(): boolean;
    clearPyannote(): void;
    getPyannote(): Pyannote | undefined;
    setPyannote(value?: Pyannote): VoiceActivityDetection;

    hasMatchbox(): boolean;
    clearMatchbox(): void;
    getMatchbox(): Matchbox | undefined;
    setMatchbox(value?: Matchbox): VoiceActivityDetection;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VoiceActivityDetection.AsObject;
    static toObject(includeInstance: boolean, msg: VoiceActivityDetection): VoiceActivityDetection.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VoiceActivityDetection, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VoiceActivityDetection;
    static deserializeBinaryFromReader(message: VoiceActivityDetection, reader: jspb.BinaryReader): VoiceActivityDetection;
}

export namespace VoiceActivityDetection {
    export type AsObject = {
        active: string,
        samplingRate: number,
        pyannote?: Pyannote.AsObject,
        matchbox?: Matchbox.AsObject,
    }
}

export class Pyannote extends jspb.Message { 
    getModelPath(): string;
    setModelPath(value: string): Pyannote;
    getMinAudioSize(): number;
    setMinAudioSize(value: number): Pyannote;
    getOffset(): number;
    setOffset(value: number): Pyannote;
    getOnset(): number;
    setOnset(value: number): Pyannote;
    getLogScale(): boolean;
    setLogScale(value: boolean): Pyannote;
    getMinDurationOff(): number;
    setMinDurationOff(value: number): Pyannote;
    getMinDurationOn(): number;
    setMinDurationOn(value: number): Pyannote;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Pyannote.AsObject;
    static toObject(includeInstance: boolean, msg: Pyannote): Pyannote.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Pyannote, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Pyannote;
    static deserializeBinaryFromReader(message: Pyannote, reader: jspb.BinaryReader): Pyannote;
}

export namespace Pyannote {
    export type AsObject = {
        modelPath: string,
        minAudioSize: number,
        offset: number,
        onset: number,
        logScale: boolean,
        minDurationOff: number,
        minDurationOn: number,
    }
}

export class Matchbox extends jspb.Message { 
    getModelConfig(): string;
    setModelConfig(value: string): Matchbox;
    getEncoderPath(): string;
    setEncoderPath(value: string): Matchbox;
    getDecoderPath(): string;
    setDecoderPath(value: string): Matchbox;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Matchbox.AsObject;
    static toObject(includeInstance: boolean, msg: Matchbox): Matchbox.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Matchbox, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Matchbox;
    static deserializeBinaryFromReader(message: Matchbox, reader: jspb.BinaryReader): Matchbox;
}

export namespace Matchbox {
    export type AsObject = {
        modelConfig: string,
        encoderPath: string,
        decoderPath: string,
    }
}

export class PostProcessing extends jspb.Message { 
    clearPipelineList(): void;
    getPipelineList(): Array<string>;
    setPipelineList(value: Array<string>): PostProcessing;
    addPipeline(value: string, index?: number): string;

    hasPostProcessors(): boolean;
    clearPostProcessors(): void;
    getPostProcessors(): PostProcessors | undefined;
    setPostProcessors(value?: PostProcessors): PostProcessing;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostProcessing.AsObject;
    static toObject(includeInstance: boolean, msg: PostProcessing): PostProcessing.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostProcessing, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostProcessing;
    static deserializeBinaryFromReader(message: PostProcessing, reader: jspb.BinaryReader): PostProcessing;
}

export namespace PostProcessing {
    export type AsObject = {
        pipelineList: Array<string>,
        postProcessors?: PostProcessors.AsObject,
    }
}

export class PostProcessors extends jspb.Message { 

    hasSymSpell(): boolean;
    clearSymSpell(): void;
    getSymSpell(): SymSpell | undefined;
    setSymSpell(value?: SymSpell): PostProcessors;

    hasNormalization(): boolean;
    clearNormalization(): void;
    getNormalization(): Normalization | undefined;
    setNormalization(value?: Normalization): PostProcessors;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostProcessors.AsObject;
    static toObject(includeInstance: boolean, msg: PostProcessors): PostProcessors.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostProcessors, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostProcessors;
    static deserializeBinaryFromReader(message: PostProcessors, reader: jspb.BinaryReader): PostProcessors;
}

export namespace PostProcessors {
    export type AsObject = {
        symSpell?: SymSpell.AsObject,
        normalization?: Normalization.AsObject,
    }
}

export class SymSpell extends jspb.Message { 
    getDictPath(): string;
    setDictPath(value: string): SymSpell;
    getMaxDictionaryEditDistance(): number;
    setMaxDictionaryEditDistance(value: number): SymSpell;
    getPrefixLength(): number;
    setPrefixLength(value: number): SymSpell;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SymSpell.AsObject;
    static toObject(includeInstance: boolean, msg: SymSpell): SymSpell.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SymSpell, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SymSpell;
    static deserializeBinaryFromReader(message: SymSpell, reader: jspb.BinaryReader): SymSpell;
}

export namespace SymSpell {
    export type AsObject = {
        dictPath: string,
        maxDictionaryEditDistance: number,
        prefixLength: number,
    }
}

export class Normalization extends jspb.Message { 
    getLanguage(): string;
    setLanguage(value: string): Normalization;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Normalization.AsObject;
    static toObject(includeInstance: boolean, msg: Normalization): Normalization.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Normalization, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Normalization;
    static deserializeBinaryFromReader(message: Normalization, reader: jspb.BinaryReader): Normalization;
}

export namespace Normalization {
    export type AsObject = {
        language: string,
    }
}

export class Logging extends jspb.Message { 
    getType(): string;
    setType(value: string): Logging;
    getPath(): string;
    setPath(value: string): Logging;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Logging.AsObject;
    static toObject(includeInstance: boolean, msg: Logging): Logging.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Logging, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Logging;
    static deserializeBinaryFromReader(message: Logging, reader: jspb.BinaryReader): Logging;
}

export namespace Logging {
    export type AsObject = {
        type: string,
        path: string,
    }
}

export enum CTCDecoding {
    GREEDY = 0,
    BEAM_SEARCH_WITH_LM = 1,
}
