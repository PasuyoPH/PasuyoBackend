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
import GetMerchantItems from './src/routes/merchant/GetItems'
import GetMerchants from './src/routes/merchant/GetMerchants'
import LikeMerchantItem from './src/routes/merchant/LikeMerchantItem'
import GetRecommendedMerchants from './src/routes/user/GetRecommendedMerchants'
import GetNewItems from './src/routes/merchant/GetNewItems'
import GetMerchantItem from './src/routes/merchant/GetMerchantItem'
import GetMerchant from './src/routes/merchant/GetMerchant'
import GetItems from './src/routes/merchant/GetItemsbyIds'
import GetMerchantData from './src/routes/merchant/GetMerchantData'
import CreateOrder from './src/routes/order/CreateOrder'
import CreatePayment from './src/routes/payment/paypal/CreatePayment'
import CompletePayment from './src/routes/payment/paypal/CompletePayment'
import Geocode from './src/routes/Geocode'
import GetFilters from './src/routes/Filters'
import CreateCashPayment from './src/routes/payment/cash/CreateCashPayment'
import GetPaymentMethods from './src/routes/GetPaymentMethods'
import NewPayment from './src/routes/payment/NewPayment'
import SearchItems from './src/routes/Search'
import GetLikedItem from './src/routes/merchant/GetLikedItem'
import GetUserLikes from './src/routes/user/GetUserLikes'
import GetUserDeliveries from './src/routes/delivery/GetUserDeliveries'
import CreateDelivery from './src/routes/delivery/CreateDelivery'
import UploadProfile from './src/routes/UploadProfile'
import GetMerchantAddresses from './src/routes/merchant/MerchantGetAddresses'
import ViewJobs from './src/routes/job2/ViewJobs'
import GetJobData from './src/routes/job2/GetJobData'
import GetJobMap from './src/routes/job2/GetJobMap'
import TakeJob from './src/routes/job2/TakeJob'
import JobDone from './src/routes/job2/JobDone'
import JobPickedUp from './src/routes/job2/JobPickedUp'
import GetUserActiveDeliveries from './src/routes/user/GetUserActiveDeliveries'
import DeleteDeliveryDraft from './src/routes/delivery/DeleteDeliveryDraft'
import GetUserJobAddresses from './src/routes/user/GetUserJobAddresses'
import AdminGetMerchants from './src/routes/admin/AdminGetMerchants'
import AdminGetLoadRequests from './src/routes/admin/AdminGetLoadRequests'
import AdminLoadAction from './src/routes/admin/AdminLoadAction'
import AdminGetTransactions from './src/routes/admin/AdminGetTransactions'
import AdminGetStats from './src/routes/admin/AdminGetStats'
import MerchantGetToken from './src/routes/merchant/MerchantGetToken'
import MerchantGetAddresses from './src/routes/merchant/MerchantGetAddresses'
import MerchantUpdateItem from './src/routes/merchant/MerchantUpdateItem'
import MerchantNewAddress from './src/routes/merchant/MerchantNewAddress'
import MerchantAddItem from './src/routes/merchant/MerchantAddItem'
import MerchantDeleteItem from './src/routes/merchant/MerchantDeleteItem'
import MerchantDeleteAddress from './src/routes/merchant/MerchantDeleteAddress'
import MerchantUpdateSelf from './src/routes/merchant/MerchantupdateSelf'
import MerchantGetOrders from './src/routes/merchant/MerchantGetOrders'
import GetRiderStats from './src/routes/rider/GetRiderStats'
import MerchantGetStats from './src/routes/merchant/MerchantGetStats'
import AdminApproveGCash from './src/routes/admin/AdminApproveGCash'
import AdminNewMerchant from './src/routes/admin/AdminNewMerchant'
import MerchantGetItems from './src/routes/merchant/MerchantGetItems'
import MerchantGetSelf from './src/routes/merchant/MerchantGetSelf'
import MerchantApproveOrder from './src/routes/merchant/MerchantApproveOrder'
import MerchantDisapproveOrder from './src/routes/merchant/MerchantDisapproveOrder'
import NewPaymentRider from './src/routes/payment/NewPaymentRider'
import GetUserActiveJobs from './src/routes/user/GetUserActiveJobs'
import GetOtherRider from './src/routes/rider/GetOtherRider'
 
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
  await http.register(GetUserLikes)
  await http.register(GetUserActiveDeliveries)
  await http.register(GetUserJobAddresses)
  
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
  await http.register(GetRiderStats)
  await http.register(NewPaymentRider)
  await http.register(GetOtherRider)

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
  await http.register(AdminNewMerchant)

  // merchant
  await http.register(GetMerchantItems)
  await http.register(GetMerchants)
  await http.register(LikeMerchantItem)
  await http.register(GetLikedItem)
  await http.register(GetNewItems)
  await http.register(GetMerchantItem)
  await http.register(GetMerchant)
  await http.register(GetItems)
  await http.register(GetMerchantData)
  await http.register(SearchItems)
  await http.register(GetMerchantAddresses)

  // PaOrder
  await http.register(CreateOrder)

  // Payment
  await http.register(NewPayment)

  // Paypal
  await http.register(CreatePayment)
  await http.register(CompletePayment)

  // Cash
  await http.register(CreateCashPayment)

  // Geocode
  await http.register(Geocode)

  // filters
  await http.register(GetFilters)
  await http.register(GetPaymentMethods)

  // deliveries
  await http.register(GetUserDeliveries)
  await http.register(CreateDelivery)
  await http.register(DeleteDeliveryDraft)

  // profile
  await http.register(UploadProfile)

  // job 2
  await http.register(ViewJobs)
  await http.register(GetJobData)
  await http.register(GetJobMap)
  await http.register(TakeJob)
  await http.register(JobDone)
  await http.register(JobPickedUp)

  // new admin
  await http.register(AdminGetMerchants)
  await http.register(AdminGetLoadRequests)
  await http.register(AdminLoadAction)
  await http.register(AdminGetTransactions)
  await http.register(AdminGetStats)
  await http.register(AdminApproveGCash)

  // merchant self
  await http.register(MerchantGetToken)
  await http.register(MerchantGetAddresses)
  await http.register(MerchantUpdateItem)
  await http.register(MerchantGetToken)
  await http.register(MerchantNewAddress)
  await http.register(MerchantAddItem)
  await http.register(MerchantDeleteItem)
  await http.register(MerchantDeleteAddress)
  await http.register(MerchantUpdateSelf)
  await http.register(MerchantGetOrders)
  await http.register(MerchantGetStats)
  await http.register(MerchantGetItems)
  await http.register(MerchantGetSelf)
  await http.register(MerchantApproveOrder)
  await http.register(MerchantDisapproveOrder)

  // user self
  await http.register(GetUserActiveJobs)
  
  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    if (http.config.debug)
      await http.log('[ERROR]:', err)
  }
}

main()