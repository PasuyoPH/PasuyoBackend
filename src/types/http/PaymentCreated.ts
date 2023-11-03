interface PaymentCreated {
  id: string // transaction id
  redirectTo?: string // if present, app will redirect to url to complete payment. otherwise would order processed (intended for cod).
}

export default PaymentCreated