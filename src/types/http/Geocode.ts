interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodingResult {
  formatted_address: string;
  address_components: AddressComponent[];
  // You can add more fields here based on your needs.
}

interface ReverseGeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export {
  ReverseGeocodingResponse,
  GeocodingResult,
  AddressComponent
}