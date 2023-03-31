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
import V2AuthCreate from './src/routes/v2/auth/Create'
import V2GetJobs from './src/routes/v2/rider/Jobs'
import V2GetAddresses from './src/routes/v2/address/GetAddresses'
import V2AuthUser from './src/routes/v2/auth/AuthUser'
import V2NewAddress from './src/routes/v2/address/NewAddress'
import V2DeleteAddress from './src/routes/v2/address/DeleteAddress'
import V2GetServices from './src/routes/v2/GetServices'
import V2GetDeliveryFees from './src/routes/v2/fees/GetDeliveryFees'
import V2CreateJob from './src/routes/v2/job/Create'
import V2CalculateDistance from './src/routes/v2/distance/Calculate'
import V2TestPushNotif from './src/routes/v2/tests/PushNotif'
import V2FinalizeJob from './src/routes/v2/job/Finalize'
import V2GetAddressesById from './src/routes/v2/address/GetAddressesById'
import V2AcceptJob from './src/routes/v2/job/Accept'
import V2CompeleteJob from './src/routes/v2/job/Complete'
import V2SetToken from './src/routes/v2/SetToken'
import V2DeleteToken from './src/routes/v2/DeleteToken'
import V2GetCurrentJob from './src/routes/v2/rider/Job'
import V2UpdateStatus from './src/routes/v2/job/UpdateStatus'
import V2UpdateProfile from './src/routes/v2/user/UpdateProfile'
import V2SetGeo from './src/routes/v2/rider/SetGeo'
 
const main = async () => {
  const http = new HttpServer(config)

  // set restana middlewares
  http.restana.use(
    bodyParser.json()
  )
  http.restana.use(
    bodyParser.urlencoded({ extended: true })
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
  await http.register(V2AuthCreate)
  await http.register(V2GetJobs)
  await http.register(V2GetAddresses)
  await http.register(V2AuthUser)
  await http.register(V2NewAddress)
  await http.register(V2DeleteAddress)
  await http.register(V2GetServices)
  await http.register(V2GetDeliveryFees)
  await http.register(V2CreateJob)
  await http.register(V2CalculateDistance)
  await http.register(V2TestPushNotif)
  await http.register(V2FinalizeJob)
  await http.register(V2GetAddressesById)
  await http.register(V2AcceptJob)
  await http.register(V2CompeleteJob)
  await http.register(V2SetToken)
  await http.register(V2DeleteToken)
  await http.register(V2GetCurrentJob)
  await http.register(V2UpdateStatus)
  await http.register(V2UpdateProfile)
  await http.register(V2SetGeo)

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    console.error(err)
  }
}

main()