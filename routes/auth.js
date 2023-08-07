const express = require("express")
const user = require("../models/user");

const router = express.Router();

router.post("/", (req, res) =>{
   console.log(req.body);
   const responseUser = user(req.body);
   responseUser.save();
   res.send("send");
})


module.exports = router;