enum TransactionStatus {
  WAITING_USER_PAYMENT,
  USER_PAID,
  USER_REFUNDED, // Special

  // For cash on delivery
  COD_WAITING_FOR_PAYMENT,
  COD_PAYMENT_CONFIRMED,

  // For gcash manual
  GCASH_MANUAL_WAITING_FOR_CONFIRMATION
}

interface Transaction {
  uid: string // id of transaction, use what payment services give us
  status: TransactionStatus
  amount: number
  user: string // user who made the transaction
  createdAt: number // when the transaction is made
  currency: string // what currency is used, should be PHP
  receipt?: string // receipt for gcash (manual)
  merchant?: string // uid of merchant who made transaction
  job: string // uid of job
}

export default Transaction
export { TransactionStatus }