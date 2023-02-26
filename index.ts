import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// Routes
import DefaultRoute from './src/routes/Default'

// Auth related
import RegisterCustomer from './src/routes/auth/RegisterCustomer'
import AuthCustomer from './src/routes/auth/AuthCustomer'
import AuthTest from './src/routes/auth/AuthTest'
import VerifyToken from './src/routes/auth/VerifyToken'

// User related
import GetUser from './src/routes/user/GetUser'

// Rider related
import AuthRider from './src/routes/rider/AuthRider'
import RegisterRider from './src/routes/rider/RegisterRider'

// Rate related
import RateRider from './src/routes/rate/RateRider'

// jobs related
import CreateJob from './src/routes/job/CreateJob'
import GetCustomerJobs from './src/routes/job/GetCustomerJobs'

// v2
import AuthCreate from './src/routes/v2/auth/Create'
import GetJobs from './src/routes/v2/rider/Jobs'
 
const main = async () => {
  const http = new HttpServer(config)

  // set restana middlewares
  http.restana.use(
    bodyParser.json()
  )

  http.restana.use(
    cors()
  )

  await http.register(DefaultRoute)

  // auth related
  await http.register(RegisterCustomer)
  await http.register(AuthCustomer)
  await http.register(AuthTest)
  await http.register(VerifyToken)

  // user related
  await http.register(GetUser)
  
  // riders related
  await http.register(AuthRider)
  await http.register(RegisterRider)

  // rates related
  await http.register(RateRider)

  // jobs related
  await http.register(CreateJob)
  await http.register(GetCustomerJobs)

  // v2
  await http.register(AuthCreate)
  await http.register(GetJobs)

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    console.error(err)
  }
}

main()