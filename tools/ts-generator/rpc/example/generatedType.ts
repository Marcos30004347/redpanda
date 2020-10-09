// Code generated by v/tools/ts-generator/rpcgen_js.py
// import Buffer Functions
import BF from "./functions";
import { IOBuf } from "../../../../src/js/modules/utilities/IOBuf";

export class RpcHeader {
  public version: number;
  public headerChecksum: number;
  public compression: number;
  public payloadSize: number;
  public meta: number;
  public correlationId: number;
  public payloadChecksum: bigint;

  /**
   * transform bytes into a buffer to RpcHeader
   * @param buffer is the place where the binary data is stored
   * @param offset is the position where the function will start to
   *        read into buffer
   * @return a tuple, where first element is a RpcHeader and second
   *        one is the read last position in the buffer
   */
  static fromBytes(buffer: Buffer, offset = 0): [RpcHeader, number] {
    return [
      {
        version: (() => {
          const [value, newOffset] = BF.readUInt8LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        headerChecksum: (() => {
          const [value, newOffset] = BF.readUInt32LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        compression: (() => {
          const [value, newOffset] = BF.readInt8LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        payloadSize: (() => {
          const [value, newOffset] = BF.readUInt32LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        meta: (() => {
          const [value, newOffset] = BF.readUInt32LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        correlationId: (() => {
          const [value, newOffset] = BF.readUInt32LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        payloadChecksum: (() => {
          const [value, newOffset] = BF.readUInt64LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
      },
      offset,
    ];
  }

  /**
   * transform from RpcHeader to binary version with Redpanda
   * standard
   * @param value is a RpcHeader instance
   * @param buffer is the binary array where the RpcHeader binary
   *        will save
   * @param offset is the position where the toBytes function starts to write
   *        in the buffer
   * @return the last position of the offset
   */
  static toBytes(value: RpcHeader, buffer: IOBuf): number {
    let wroteBytes = 0;
    wroteBytes += BF.writeUInt8LE(value.version, buffer);
    wroteBytes += BF.writeUInt32LE(value.headerChecksum, buffer);
    wroteBytes += BF.writeInt8LE(value.compression, buffer);
    wroteBytes += BF.writeUInt32LE(value.payloadSize, buffer);
    wroteBytes += BF.writeUInt32LE(value.meta, buffer);
    wroteBytes += BF.writeUInt32LE(value.correlationId, buffer);
    wroteBytes += BF.writeUInt64LE(value.payloadChecksum, buffer);
    return wroteBytes;
  }
}

export class MetadataInfo {
  public inputs: Array<string>;
  public name: string;
  public age: number;
  public isCool: boolean;
  public id: bigint;
  public data: Buffer;

  /**
   * transform bytes into a buffer to MetadataInfo
   * @param buffer is the place where the binary data is stored
   * @param offset is the position where the function will start to
   *        read into buffer
   * @return a tuple, where first element is a MetadataInfo and second
   *        one is the read last position in the buffer
   */
  static fromBytes(buffer: Buffer, offset = 0): [MetadataInfo, number] {
    return [
      {
        inputs: (() => {
          const [array, newOffset] = BF.readArray(
            buffer,
            offset,
            (auxBuffer, auxOffset) => BF.readString(auxBuffer, auxOffset)
          );
          offset = newOffset;
          return array;
        })(),
        name: (() => {
          const [value, newOffset] = BF.readString(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        age: (() => {
          const [value, newOffset] = BF.readInt8LE(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        isCool: (() => {
          const [value, newOffset] = BF.readBoolean(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        id: (() => {
          const [value, newOffset] = BF.readVarint(buffer, offset);
          offset = newOffset;
          return value;
        })(),
        data: (() => {
          const [value, newOffset] = BF.readBuffer(buffer, offset);
          offset = newOffset;
          return value;
        })(),
      },
      offset,
    ];
  }

  /**
   * transform from MetadataInfo to binary version with Redpanda
   * standard
   * @param value is a MetadataInfo instance
   * @param buffer is the binary array where the MetadataInfo binary
   *        will save
   * @param offset is the position where the toBytes function starts to write
   *        in the buffer
   * @return the last position of the offset
   */
  static toBytes(value: MetadataInfo, buffer: IOBuf): number {
    let wroteBytes = 0;

    wroteBytes += BF.writeArray(value.inputs, buffer, (item, auxBuffer) =>
      BF.writeString(item, auxBuffer)
    );
    wroteBytes += BF.writeString(value.name, buffer);
    wroteBytes += BF.writeInt8LE(value.age, buffer);
    wroteBytes += BF.writeBoolean(value.isCool, buffer);
    wroteBytes += BF.writeVarint(value.id, buffer);
    wroteBytes += BF.writeBuffer(value.data, buffer);
    return wroteBytes;
  }
}

export class EnableTopicsReply {
  public inputs: Array<number>;

  /**
   * transform bytes into a buffer to EnableTopicsReply
   * @param buffer is the place where the binary data is stored
   * @param offset is the position where the function will start to
   *        read into buffer
   * @return a tuple, where first element is a EnableTopicsReply and second
   *        one is the read last position in the buffer
   */
  static fromBytes(buffer: Buffer, offset = 0): [EnableTopicsReply, number] {
    return [
      {
        inputs: (() => {
          const [array, newOffset] = BF.readArray(
            buffer,
            offset,
            (auxBuffer, auxOffset) => BF.readInt8LE(auxBuffer, auxOffset)
          );
          offset = newOffset;
          return array;
        })(),
      },
      offset,
    ];
  }

  /**
   * transform from EnableTopicsReply to binary version with Redpanda
   * standard
   * @param value is a EnableTopicsReply instance
   * @param buffer is the binary array where the EnableTopicsReply binary
   *        will save
   * @param offset is the position where the toBytes function starts to write
   *        in the buffer
   * @return the last position of the offset
   */
  static toBytes(value: EnableTopicsReply, buffer: IOBuf): number {
    let wroteBytes = 0;

    wroteBytes += BF.writeArray(value.inputs, buffer, (item, auxBuffer) =>
      BF.writeInt8LE(item, auxBuffer)
    );
    return wroteBytes;
  }
}

export class DisableTopicsReply {
  public inputs: Array<number>;

  /**
   * transform bytes into a buffer to DisableTopicsReply
   * @param buffer is the place where the binary data is stored
   * @param offset is the position where the function will start to
   *        read into buffer
   * @return a tuple, where first element is a DisableTopicsReply and second
   *        one is the read last position in the buffer
   */
  static fromBytes(buffer: Buffer, offset = 0): [DisableTopicsReply, number] {
    return [
      {
        inputs: (() => {
          const [array, newOffset] = BF.readArray(
            buffer,
            offset,
            (auxBuffer, auxOffset) => BF.readInt8LE(auxBuffer, auxOffset)
          );
          offset = newOffset;
          return array;
        })(),
      },
      offset,
    ];
  }

  /**
   * transform from DisableTopicsReply to binary version with Redpanda
   * standard
   * @param value is a DisableTopicsReply instance
   * @param buffer is the binary array where the DisableTopicsReply binary
   *        will save
   * @param offset is the position where the toBytes function starts to write
   *        in the buffer
   * @return the last position of the offset
   */
  static toBytes(value: DisableTopicsReply, buffer: IOBuf): number {
    let wroteBytes = 0;

    wroteBytes += BF.writeArray(value.inputs, buffer, (item, auxBuffer) =>
      BF.writeInt8LE(item, auxBuffer)
    );
    return wroteBytes;
  }
}
