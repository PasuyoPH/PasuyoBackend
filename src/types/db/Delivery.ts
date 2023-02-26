interface IDeliveryInfo {
  fullName: string
  location: string

  landmark?: string
}

interface IDelivery {
  from: IDeliveryInfo
  to: IDeliveryInfo

  item: string
}

export {
  IDelivery,
  IDeliveryInfo
}