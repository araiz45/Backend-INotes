const db = require("./db");
const express = require('express')
const app = express()
const port = 3000
db(); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running successfully at  ${port}`)
})

