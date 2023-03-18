interface Geo {
  longitude: number
  latitude: number
}

interface GeoCacheData extends Geo {  
  uid: string // rider uid
}

export {
  GeoCacheData,
  Geo
}