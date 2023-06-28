import Path from '../base/Path'

class DefaultRoute extends Path {
  public async onRequest() {
    return {
      value: 'ok',
      code: 200
    }
  }
}

export default DefaultRoute