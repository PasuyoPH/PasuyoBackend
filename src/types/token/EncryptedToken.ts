interface EncryptedToken {
  iv: string
  token: string
  expiresAt: number
}

export default EncryptedToken