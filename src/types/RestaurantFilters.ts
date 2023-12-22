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
}

const filters = [
  {
    name: 'All',
    type: RestaurantFilterTypes.ALL
  },

  {
    name: 'Pizza',
    type: RestaurantFilterTypes.PIZZA
  },

  {
    name: 'Chicken',
    type: RestaurantFilterTypes.CHICKEN
  },

  {
    name: 'Ice Cream',
    type: RestaurantFilterTypes.BRR_COLD_BUSS_NIGGA
  },

  {
    name: 'Burger',
    type: RestaurantFilterTypes.BURGER
  },

  {
    name: 'Coffee',
    type: RestaurantFilterTypes.COFFEE
  },

  {
    name: 'Other',
    type: RestaurantFilterTypes.OTHER
  },
]

export {
  filters as RestaurantFilters,
  RestaurantFilterTypes,
  RestaurantFilter
}