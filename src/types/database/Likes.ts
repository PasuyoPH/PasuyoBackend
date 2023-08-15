interface Likes {
  product: string // uid of product liked
  user: string // uid of the user who liked
  likedAt: number
  merchant: string // merchant who owns the item
}

export default Likes