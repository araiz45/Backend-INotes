// getting database internal module
const db = require("./db");
// express require
const express = require('express');
// require app and intializing express
const app = express()
// port on which data base will be stated
const port = 5000
// calling database function which is require from database
db(); 
// telling express that we are going to send json file
app.use(express.json())
// telling express that after local host use api/auth and go to routes
app.use("/api/auth", require("./routes/auth"))
// some as here api/notes and go to notes
app.use("/api/notes", require("./routes/notes"))
// app is listening at port variables
app.listen(port, () => {
  // logging if server is started
  console.log(`Server is running successfully at  ${port}`)
})

