import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// Routes
import DefaultRoute from './src/routes/Default'
import AuthUser from './src/routes/auth/AuthUser'
import AuthCreate from './src/routes/auth/AuthCreate'
import GetRiderJobs from './src/routes/rider/GetRiderJobs'
import GetUserAddresses from './src/routes/addresses/GetUserAddresses'
import NewUserAddress from './src/routes/addresses/NewUserAddress'
import DeleteUserAddress from './src/routes/addresses/DeleteUserAddress'
import GetServices from './src/routes/GetServices'
import CreateJob from './src/routes/job/CreateJobPreview'
import CalculateUserDistance from './src/routes/distance/CalculateUserDistance'
import CalculateRiderDistance from './src/routes/distance/CalculateRiderDistance'
import FinalizeJob from './src/routes/job/FinalizeJob'
import GetUserAddressesById from './src/routes/addresses/GetUserAddressesById'
import AcceptJob from './src/routes/job/AcceptJob'
import CompleteJob from './src/routes/job/CompleteJob'
import GetRiderCurrentJob from './src/routes/rider/GetRiderCurrentJob'
import UpdateJobStatus from './src/routes/job/UpdateJobStatus'
import UpdateRiderProfile from './src/routes/rider/UpdateRiderProfile'
import UpdateUserProfile from './src/routes/user/UpdateUserProfile'
import GetRiderHistory from './src/routes/rider/GetRiderHistory'
import GetJob from './src/routes/job/GetJob'
import GetJobAddresses from './src/routes/job/GetJobAddresses'
import ViewJobs from './src/routes/job/ViewJobs'
import GetUser from './src/routes/user/GetUser'
import GetRider from './src/routes/rider/GetRider'
import GetPromos from './src/routes/GetPromos'
import GetUserJobs from './src/routes/user/GetUserJobs'
import GetUserDrafts from './src/routes/user/GetUserDrafts'
import GetUserHistory from './src/routes/user/GetUserHistory'
import EditUserAddress from './src/routes/addresses/EditUserAddress'
import GetAddressUsed from './src/routes/job/GetAddressUsed'
import GetNotifications from './src/routes/notifications/GetNotifications'
import GetRiderFeeForJob from './src/routes/job/GetRiderFeeForJob'
import GetAddressUsedRider from './src/routes/job/GetAddressUsedRider'
import GetJobAuthor from './src/routes/job/GetJobAuthor'
import RiderOptIn from './src/routes/rider/RiderOptIn'
import FetchRiders from './src/routes/FetchRiders'
import GetJobRider from './src/routes/job/GetJobRider'
import UpdateUserExpoToken from './src/routes/expo-token/UpdateUserExpoToken'
 
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

  // General
  await http.register(DefaultRoute)
  await http.register(GetServices)
  await http.register(GetPromos)
  await http.register(FetchRiders)

  // Authentication
  await http.register(AuthUser)
  await http.register(AuthCreate)

  // User
  await http.register(GetUserAddresses)
  await http.register(NewUserAddress)
  await http.register(DeleteUserAddress)
  await http.register(EditUserAddress)
  await http.register(GetUserAddressesById)
  await http.register(GetUser)
  await http.register(GetUserJobs)
  await http.register(GetUserDrafts)
  await http.register(GetUserHistory)
  await http.register(GetAddressUsed)
  await http.register(UpdateUserProfile)
  
  // Jobs?
  await http.register(GetRiderJobs)
  await http.register(CreateJob)
  await http.register(FinalizeJob)
  await http.register(AcceptJob)
  await http.register(CompleteJob)
  await http.register(UpdateJobStatus)
  await http.register(GetRiderFeeForJob)
  await http.register(GetJobAddresses)
  await http.register(GetAddressUsedRider)
  await http.register(GetJobAuthor)
  await http.register(GetJobRider)
  await http.register(GetJob)
  await http.register(ViewJobs)

  // Distance
  await http.register(CalculateUserDistance)
  await http.register(CalculateRiderDistance)

  // Rider
  await http.register(GetRiderCurrentJob)
  await http.register(UpdateRiderProfile)
  await http.register(GetRiderHistory)
  await http.register(GetRider)
  await http.register(RiderOptIn)

  // User tokens
  await http.register(UpdateUserExpoToken)

  await http.register(GetNotifications)
  
  // v2
  /*await http.register(V2GetRiderFee)
  await http.register(V2AuthCreate)
  await http.register(V2GetJobs)
  await http.register(V2GetAddresses)
  await http.register(V2AuthUser)
  await http.register(V2NewAddress)
  await http.register(V2DeleteAddress)
  await http.register(V2GetServices)
  await http.register(V2GetDeliveryFees) (UNUSED)
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
  await http.register(V3AdminGetRiders)*/

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    if (http.config.debug)
      await http.log('[ERROR]:', err)
  }
}

main()