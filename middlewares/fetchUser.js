// adding json web token as external module
let jwt = require("jsonwebtoken");
// secret key for jws authentication
const secret_key = "araiz453zen12";
const fetchUser = (req, res, next) =>{
// get the user from jwt token and id to request object
    const token = req.header('auth-token')
    // console.log(req)
    if(!token){
        res.status(400).send({error: 'Please authenticate using token'})
    }
    try {
        const data = jwt.verify(token, secret_key)
        // console.log(data)
        req.user = data.user
        next()   
    } catch (error) {
        res.status(400).send({error: 'Please authenticate using token'})
    }
}

module.exports = fetchUser