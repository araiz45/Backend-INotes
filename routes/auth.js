const express = require("express")
const user = require("../models/user");
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post("/", [
    body('name', 'enter valid name').isLength({min: 3}),
    body('email', 'enter valid email').isEmail(),
    body('password', 'password must be 5 letters long').isLength({min: 5})
],(req, res) =>{
//    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }

    user.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user => res.json(user))
    .catch(err => {console.log(err)
    
        res.json({error: 'Please enter unique value for json', message: err.message})
    })
//    const responseUser = user(req.body);
//    responseUser.save();
})


module.exports = router;