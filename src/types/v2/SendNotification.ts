interface SendNotificationOptions {
  title: string
  content: string
  token: string[]
  rider?: boolean
  users?: string[]
}

export default SendNotificationOptions