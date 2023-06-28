enum AdminRoles {
  ACCOUNTING,
  VERIFYER,
  SUPPORT,
  ADMIN
}

// admin table
interface Admin {
  uid: string
  username: string
  password?: string
  role: AdminRoles
  createdAt: number
}

export default Admin
export { AdminRoles }