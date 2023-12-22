// TOOD: Move to db
enum RestaurantFilterTypes {
  ALL,
  PIZZA,
  CHICKEN,
  BRR_COLD_BUSS_NIGGA,
  BURGER,
  COFFEE,
  OTHER,
}

interface RestaurantFilter {
  name: string
  type: RestaurantFilterTypes
  icon?: string
}

const filters: RestaurantFilter[] = [
  {
    name: 'All',
    type: RestaurantFilterTypes.ALL,
    icon: 'concierge-bell'
  },

  {
    name: 'Pizza',
    type: RestaurantFilterTypes.PIZZA,
    icon: 'pizza-slice'
  },

  {
    name: 'Chicken',
    type: RestaurantFilterTypes.CHICKEN,
    icon: 'drumstick-bite'
  },

  {
    name: 'Ice Cream',
    type: RestaurantFilterTypes.BRR_COLD_BUSS_NIGGA,
    icon: 'ice-cream'
  },

  {
    name: 'Burger',
    type: RestaurantFilterTypes.BURGER,
    icon: 'burger'
  },

  {
    name: 'Coffee',
    type: RestaurantFilterTypes.COFFEE,
    icon: 'coffee'
  },

  {
    name: 'Other',
    type: RestaurantFilterTypes.OTHER,
    icon: 'bowl-food'
  },
]

export {
  filters as RestaurantFilters,
  RestaurantFilterTypes,
  RestaurantFilter
}