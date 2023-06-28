interface PathPermissions {
  check?: 'user' | 'rider' | 'admin' | 'none' // Default would be: none
  role?: number[] // For user checks that use role system. For now only admins
  verified?: boolean // Use this check if you want users to have verified status. For now only works on riders.
}

export default PathPermissions