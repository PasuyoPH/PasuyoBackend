enum IdentifyType {
  BACKEND,
  PANEL_A,
  PANEL_M,
  RIDER,
  USER
}

interface IdenitfyData {
  token: string
  type: IdentifyType
}

export default IdenitfyData
export { IdentifyType }