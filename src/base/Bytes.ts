class Bytes {
  private buffer: Buffer
  private offset: number = 0

  constructor(public size: number = 1) {
    this.buffer = Buffer.alloc(this.size)
  }

  private writeInt(
    value: number,
    len: number
  ) {
    if (!this.buffer)
      this.buffer = Buffer.alloc(len > this.size ? len : this.size)

    if (this.offset + len >= this.buffer.length)
      throw new Error('Buffer overflow')
    
    this.buffer.writeUIntLE(value, this.offset, len)
    this.offset += len
  }

  public writeInt8(value: number) {
    this.writeInt(value, 1)
    return this
  }

  public writeInt16(value: number) {
    this.writeInt(value, 2)
    return this
  }

  public writeInt32(value: number) {
    this.writeInt(value, 4)
    return this
  }

  public writeStr(value: string) {
    if (!this.buffer)
      this.buffer = Buffer.alloc(value.length)

    if (this.offset + value.length > this.buffer.length)
      throw new Error('Buffer overflow')

    this.buffer.write(value, this.offset, 'utf-8')
    this.offset += value.length
    
    return this
  }

  public data() {
    return this.buffer
  }
}

export default Bytes