import { TransactionStatus } from './Transaction'

interface MerchantTransaction {
  uid: string // id of transaction, use what payment services give us
  status: TransactionStatus
  amount: number // total price paid
  user: string // user who made the transaction
  createdAt: number // when the transaction is made
  currency: string // what currency is used, should be PHP
  merchant?: string // uid of merchant who made transaction
}

export default MerchantTransaction