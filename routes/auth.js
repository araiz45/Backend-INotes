const express = require("express")
const router = express.Router();

router.get("/", (req, res) =>{
    let obj = {
        name: "injir",
        phone: "343434334"
    }
    res.json(obj)
})


module.exports = router;