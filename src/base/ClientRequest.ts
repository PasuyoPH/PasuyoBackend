import { HttpReq } from '../types/Http'

// Wrapper for HttpReq type
class ClientRequest {
  constructor(public req: HttpReq) {}

  public query(key: string) {
    return this.req.query[key] ?? null
  }

  public params(key: string) {
    return this.req.params[key] ?? null
  }

  public body<T>(key: string): T | null {
    return (this.req.body[key] as T) ?? null
  }
}

export default ClientRequest