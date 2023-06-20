enum V3AdminRoles {
  ACCOUNTING,
  VERIFYER,
  SUPPORT,
  ADMIN
}

// admin table
interface V3Admin {
  uid: string
  username: string
  password?: string
  role: V3AdminRoles
  createdAt: number
}

export default V3Admin
export { V3AdminRoles }