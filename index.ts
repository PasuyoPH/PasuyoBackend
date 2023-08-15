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
import AddRiderCredits from './src/routes/admin/AddRiderCredits'
import AdminVerifyRider from './src/routes/admin/AdminVerifyRider'
import AdminGetRiders from './src/routes/admin/GetRiders'
import GetAdminSelf from './src/routes/admin/GetAdminSelf'
import AdminApproveLoad from './src/routes/admin/AdminApproveLoad'
import RiderRequestLoad from './src/routes/rider/RiderRequestLoad'
import GetAdminToken from './src/routes/admin/GetAdminToken'
import AddItemToMerchant from './src/routes/merchant/AddItem'
import GetMerchantItems from './src/routes/merchant/GetItems'
import GetOrders from './src/routes/orders/GetOrders'
import GetMerchants from './src/routes/merchant/GetMerchants'
import LikeMerchantItem from './src/routes/merchant/LikeMerchantItem'
import GetRecommendedMerchants from './src/routes/user/GetRecommendedMerchants'
import GetNewItems from './src/routes/merchant/GetNewItems'
import GetMerchantItem from './src/routes/merchant/GetMerchantItem'
import GetMerchant from './src/routes/merchant/GetMerchant'
import GetItems from './src/routes/merchant/GetItemsbyIds'
 
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
  await http.register(GetRecommendedMerchants)
  
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
  await http.register(RiderRequestLoad)

  // User tokens
  await http.register(UpdateUserExpoToken)

  await http.register(GetNotifications)

  // admin
  await http.register(AddRiderCredits)
  await http.register(AdminVerifyRider)
  await http.register(AdminGetRiders)
  await http.register(GetAdminSelf)
  await http.register(AdminApproveLoad)
  await http.register(GetAdminToken)

  // merchant
  await http.register(AddItemToMerchant)
  await http.register(GetMerchantItems)
  await http.register(GetMerchants)
  await http.register(LikeMerchantItem)
  await http.register(GetNewItems)
  await http.register(GetMerchantItem)
  await http.register(GetMerchant)
  await http.register(GetItems)

  // orders
  await http.register(GetOrders)

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    if (http.config.debug)
      await http.log('[ERROR]:', err)
  }
}

main()