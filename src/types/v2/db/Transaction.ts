interface V2Transaction {
  uid: string
  target: string
  credits: number
  proof?: string
}

export default V2Transaction