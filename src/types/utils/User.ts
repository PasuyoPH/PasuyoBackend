import { HttpUser } from '../v2/http/User'

interface CreateUserOptions {
  user: HttpUser
  rider?: boolean
}

export default CreateUserOptions