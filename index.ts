import config from './config.json'
import HttpServer from './src/base/HttpServer'

import bodyParser from 'body-parser'
import cors from 'cors'

// Routes
import DefaultRoute from './src/routes/Default'

// Test routes
import TestHelloWorld from './src/routes/test/HelloWorld'
import TestUserCreate from './src/routes/test/TestUserCreation'

import TestUserLogin from './src/routes/test/TestUserLogin'

// Meals
import GetMeal from './src/routes/meals/GetMeal'

// Companies
import GetCompany from './src/routes/companies/GetCompany'
import GetCompanies from './src/routes/companies/GetCompanies'

// Orders
import CreateOrder from './src/routes/orders/CreateOrder'
import ModifyOrderStatus from './src/routes/orders/ModifyOrderStatus'
import ClaimOrder from './src/routes/orders/ClaimOrder'
import RequestToken from './src/routes/auth/RequestToken'
import GetOrders from './src/routes/orders/GetOrders'

// Deliveries
import CreateDelivery from './src/routes/deliveries/CreateDelivery'
 
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

  await http.register(TestHelloWorld)
  await http.register(TestUserCreate)
  await http.register(TestUserLogin)

  await http.register(GetCompany)
  await http.register(GetCompanies)

  await http.register(GetMeal)

  await http.register(CreateOrder)
  await http.register(ModifyOrderStatus)
  await http.register(ClaimOrder)
  await http.register(GetOrders)

  // user
  await http.register(RequestToken)

  // delivery
  await http.register(CreateDelivery)

  try {
    await http.ready()
    await http.log('Backend ready with port:', config.http.port)
  } catch(err) {
    console.error(err)
  }
}

main()