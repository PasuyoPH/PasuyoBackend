const axios = require('axios').default,
  URL = 'http://localhost:8080/api'

const main = async () => {
  const { data } = await axios.post(
    URL + '/auth/customer',
    {
      email: 'alexander.ms9673@gmail.com',
      pin: '0615'
    }
  )

  if (!data) throw new Error('req failed.')
  const { value: token } = data
  
  console.log(token)
}

main()
  .catch(console.error)