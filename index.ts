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
import V2GetRiderHistory from './src/routes/v2/rider/History'
import V2GetJob from './src/routes/v2/job/GetJob'
import V2GetJobAddress from './src/routes/v2/job/Address'
import V2ViewJobs from './src/routes/v2/rider/ViewJobs'
import V2GetRiderFee from './src/routes/v2/job/GetRiderFee'
import V2OptInLocation from './src/routes/v2/rider/OptInLocation'
import V2DeleteJob from './src/routes/v2/job/DeleteJob'
import V2GetUser from './src/routes/v2/user/GetUser'
import V2GetNotifications from './src/routes/v2/notifications/GetNotifications'
import V2DeleteNotification from './src/routes/v2/notifications/DeleteNotification'
import V2AddNotification from './src/routes/v2/notifications/AddNotification'
import V2GetDrafts from './src/routes/v2/drafts/GetDrafts'
import V2DeleteDraft from './src/routes/v2/drafts/DeleteDraft'
import V2GetUserJobs from './src/routes/v2/user/GetJobs'
import V2GetUserJob from './src/routes/v2/user/GetUserJob'
import V2AdminVerifyToken from './src/routes/admin/VerifyToken'
import V2GetLoadRequests from './src/routes/admin/GetLoadRequests'
import V2ApproveCredits from './src/routes/admin/ApproveCredits'
import V2RiderRequestLoad from './src/routes/v2/rider/RequestLoad'
import V2RiderUploadID from './src/routes/v2/rider/UploadId'
import V2VerifyRider from './src/routes/admin/VerifyRider'
import V2AdminGetUnverifiedRiders from './src/routes/admin/GetUnverifiedRiders'
import V2GetPromos from './src/routes/v2/GetPromos'
import V2AdminGetRiders from './src/routes/admin/GetRiders'
import V2AdminModifyRider from './src/routes/admin/ModifyRider'
import V2AdminModifyCredits from './src/routes/admin/ModifyCredits'
import V2AdminDeleteRider from './src/routes/admin/DeleteRider'
import V2GetVersion from './src/routes/v2/Version'
import V2AdminGetUsers from './src/routes/admin/GetUsers'
import V2GetHistory from './src/routes/v2/user/GetHistory'
import V2ModifyAddress from './src/routes/v2/address/ModifyAddress'

// v3 routes
import V3CreateAdmin from './src/routes/v3/admin/Create'
import V3AuthAdmin from './src/routes/v3/admin/Auth'
import V3GetAdminSelf from './src/routes/v3/admin/GetSelf'
import V3VerifyRider from './src/routes/v3/admin/Verifyer/VerifyRider'
import V3ModifyCredits from './src/routes/v3/admin/Accounting/ModifyCredits'
import V3AdminGetRiders from './src/routes/v3/admin/Riders'
 
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
  await http.register(V2GetRiderFee)
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
  await http.register(V2GetRiderHistory)
  await http.register(V2GetJob)
  await http.register(V2GetJobAddress)
  await http.register(V2ViewJobs)
  await http.register(V2OptInLocation)
  await http.register(V2DeleteJob)
  await http.register(V2GetHistory)
  await http.register(V2GetUserJobs)
  await http.register(V2GetUserJob)
  await http.register(V2GetUser)
  await http.register(V2GetNotifications)
  await http.register(V2DeleteNotification)
  await http.register(V2AddNotification)
  await http.register(V2GetDrafts)
  await http.register(V2DeleteDraft)
  await http.register(V2RiderRequestLoad)
  await http.register(V2RiderUploadID)
  await http.register(V2GetPromos)
  await http.register(V2GetVersion)
  await http.register(V2ModifyAddress)

  // admin only
  await http.register(V2AdminVerifyToken)
  await http.register(V2GetLoadRequests)
  await http.register(V2ApproveCredits)
  await http.register(V2VerifyRider)
  await http.register(V2AdminGetUnverifiedRiders)
  await http.register(V2AdminGetRiders)
  await http.register(V2AdminModifyRider)
  await http.register(V2AdminModifyCredits)
  await http.register(V2AdminDeleteRider)
  await http.register(V2AdminGetUsers)

  // v3
  await http.register(V3CreateAdmin)
  await http.register(V3AuthAdmin)
  await http.register(V3GetAdminSelf)

  await http.register(V3VerifyRider)
  await http.register(V3ModifyCredits)
  await http.register(V3AdminGetRiders)

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    if (http.config.debug)
      await http.log('[ERROR]:', err)
  }
}

main()