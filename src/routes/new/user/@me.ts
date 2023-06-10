import Path from '../../../base/Path'

class UserMe extends Path {
  public path = '/user/@me'
  public requireUserToken = true

  public async onRequest() {
    const user = { ...this.user }
    delete user.pin

    return {
      value: user,
      code: 200
    }
  }
}

export default UserMe