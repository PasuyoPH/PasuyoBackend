type RestrictionsAllowed = 'backend' | 'a.panel' | 'm.panel' | 'user' | 'rider' | 'none'
type ProtocolRestrictions = RestrictionsAllowed | RestrictionsAllowed[]

export {
  RestrictionsAllowed,
  ProtocolRestrictions
}