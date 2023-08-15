interface Order {
  job: string // the id of the job it belongs to
  item: string // id of the item
  quantity: number // amount of items in the order
  merchant: string // the merchant the order belongs to
}

export default Order