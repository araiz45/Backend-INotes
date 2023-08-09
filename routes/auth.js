// add express as external module
const express = require("express");
// importing bcrypt
var bcrypt = require("bcryptjs");
// importing schema which we create in models folder
const user = require("../models/user");
// adding validator from external modules
const { body, validationResult } = require("express-validator");
// adding json web token as external module
let jwt = require("jsonwebtoken");

const fetchUser = require("../middlewares/fetchUser");
const { useId } = require("react");
// adding routes from external modules express
const router = express.Router();
// secret key for jws authentication
const secret_key = "araiz453zen12";
// ROUTE # 1 : posting user to create a user
router.post(
  "/createuser",
  [
    // validate name which ensure that the lenght is not minimun than 3
    body("name", "enter valid name").isLength({ min: 3 }),
    // validatoe email which ensure that this is an email or not
    body("email", "enter valid email").isEmail(),
    // password is not shorter than 3 letters
    body("password", "password must be 5 letters long").isLength({ min: 5 }),
    // making a asynchronous program for ensure than we can await values
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // this line ensure there no error in above validator and post request obey the above code
    if (!errors.isEmpty()) {
      // retrun if there is an error, the request is return an array of json of error and 400 bad request
      return res.status(400).json({ errors: errors.array() });
    }
    // using try to ensure that their is no error if error than moves towared to catch
    try {
      // finding user in the data base
      let userFind = await user.findOne({ email: req.body.email });
      // checking if the user already exist or not
      if (userFind) {
        // return bad request if the user already exist
        return res.status(400).json({ error: "User already exist" });
      }
      // salting password
      let salt = await bcrypt.genSalt(10);
      // making password hash and await it
      let secPass = await bcrypt.hash(req.body.password, salt);
      // creating new document into the data base
      let User = await user.create({
        // making request of name
        name: req.body.name,
        // email
        email: req.body.email,
        // & password
        password: secPass,
      });
      // making data object and use it in the jwt sign
      const data = {
        // user object which is taking id of the user
        user: {
          // id has been get from user.id
          id: user.id,
        },
      };
      // making jwt sign using data and secret key as a paramether
      const authToken = jwt.sign(data, secret_key);
      // loggin token into the console
      console.log(authToken);
      // sending response to back
      res.json({ authToken });
      // catching error
    } catch (err) {
      // loging error's message
      console.error(err.message);
      // returning back bad request status
      res.status(500).send("Some error occur");
    }
  }
);
//  ROUTE # 3 : creating login authentication
router.post(
  "/login",
  [
    // validatoe email which ensure that this is an email or not
    body("email", "enter valid email").isEmail(),
    // password will not be blank
    body("password", "password can not be blank").exists(),
    // making a asynchronous program for ensure than we can await values
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // this line ensure there no error in above validator and post request obey the above code
    if (!errors.isEmpty()) {
      // retrun if there is an error, the request is return an array of json of error and 400 bad request
      return res.status(400).json({ errors: errors.array() });
    }
    // destucturing of req.body
    const {email, password} = req.body;
    // trying if there is no error else go in catch
    try {
      // finding and getting into userFinding using email
      let usersFinding = await user.findOne({email: email});
    //   console.log(usersFinding)
      // if their is not of user execute this block
      if (!usersFinding) {
        // return with bad request and say user does not exist as json
        return res
          .status(400)
          .json({ error: "Login using correct credentials" });
      }
      // bcrypt compare get two arguments given password and hash of the password and return true or false
      const passwordCompare = await bcrypt.compare(password, usersFinding.password);
      // if password is mismatch then this block of code will execute
      if (!passwordCompare) {
        // we don't want to share that user or password is incorrect
        return res
          .status(400)
          .json({ error: "Login using correct credentials" });
      }
      // making data object and use it in the jwt sign
      const payload = {
        // user object which is taking id of the user
        user: {
          // id has been get from user.id
          id: await usersFinding.id,

        },
      };
      console.log(payload)
      // making jwt sign using data and secret key as a paramether
      const authToken = jwt.sign(payload, secret_key);
      // sending response to back
      res.json({ authToken });
    } catch (error) {
      // loging error's message
      console.error(error.message);
      // returning back bad request status
      res.status(500).send("Internal server errorx");
    }
  }
);
// ROUTE # 3: 
router.post(
    "/getuser", fetchUser,async (req, res) => {
      try {
        let userIds = req.user.id;
        const userFind = await user.findById(userIds).select("-password")
        // const userFind = await user.findById({id: userIds}).select("-password")
        res.json({users : userFind})
      } catch (error) {
        // loging error's message
        console.error(error.message);
        // returning back bad request status
        res.status(500).send("Internal server error fro get user");
      }
    })

// exporting modules
module.exports = router;
