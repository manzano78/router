const createApp = require('express')

const app = createApp()

app.get('/', (req, res) => {
  console.log(req.ip)
  res.send({
    test: 'toto'
  })
})

app.listen(4000, () => {
  console.log('server started')
})
