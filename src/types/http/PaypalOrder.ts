interface PaypalOrderLink {
  href: string
  rel: 'self' | 'approve' | 'update' | 'capture' | 'payer-action'
  method: 'GET' | 'PATCH' | 'POST'
}

interface PaypalOrder {
  id: string
  status: string
  links: PaypalOrderLink[]
}

export default PaypalOrder
export { PaypalOrderLink }