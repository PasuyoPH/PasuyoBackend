const Base = 'https://api-m.sandbox.paypal.com',
  PaypalRoutes = {
    ACCESS_TOKEN: Base + '/v1/oauth2/token',
    CREATE_ORDER: Base + '/v2/checkout/orders',
    CAPTURE_ORDER: (id: string) => Base + '/v2/checkout/orders/' + id + '/capture'
  }

export default PaypalRoutes