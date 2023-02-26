const axios = require('axios').default,
  URL = 'http://localhost:8080/api',
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpdiI6ImFkNTk2ZGE5YzNjNzFmM2NlZThjODhjYzk2MzI2MDkyIiwidG9rZW4iOiJiYmNiNzY2NTc5YTIzNjllNTc1YmNkODhmZjM2Zjg1YzhjMmYzYmZmN2Y5MWFjZTFjYTNhY2M1OGQxOGU3ZGMyMDFlOTBkOTNlOTljZTBhMzQ5ZjBhNzg2ZjhkZTg3ZmQ1NjMzYmUyNWVlYTU1MDQ0NjVhMDc1MDBlMzgxYTE0ZTQwYTQyZTYwYjQ0YTc0NGUzOGVjMGYwOTgyYTM5MzA3ZTA4OTgwZDc0NGNhNTQ1N2ZhMWIxNzdiOTI5ODlkYTM1YzA5N2RkMGVkNDIwNWExMjk5MjI3NjQ4M2U3MWJhMzZlZDY4NTk0MTViNzcxMmFmMjY3MTZjZjRlM2M5ODA2NjE2N2Y1NmU3YmY3Y2VlOTg2ZTYyNjU5N2E5ZTdmNGFmYTI4YmMwZGU3ZDAyMWQzZGFkNWJiOWM2Mjc5ZjcwN2VkM2Y3ZjViZDA5NjUwMGQ0OTU0MGE0ODZkZGNiODA3OGM0Y2Q0NmUyNjMyNDE0NmUwNDEwOGM5OWZjOThjYTU2NTFlZDQxZTVhOWUwZjlhYzdkMzdiOTc5Njk5NWFkODkyNzM0N2U4NGFlNDA4YTcxOGEyODJkNTljMTQ5NDM2IiwiaWF0IjoxNjc0NjE2MjkzfQ.oa9hbMUxEjYyAaTPN9PH0sbcMPZRYKicUUqNx1c86wg'

const main = async () => {
  const res = await axios.post(
    URL + '/job',
    {
      type: 0,
      data: {
        from: {
          fullName: 'Alexander Montoya',
          location: 'Lot 19 Blk 6 Casoy St.'
        },

        item: 'Box',
        
        to: {
          fullName: 'Test User',
          location: 'Test Location',
          landmark: 'Test landmark'
        }
      }
    },
    {
      headers: {
        Authorization: token
      }
    }
  )

  console.log(res)
}

main()
  .catch(console.error)