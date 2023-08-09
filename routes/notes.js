const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Notes = require("../models/Notes")

router.get("/fetchallnotes", fetchUser ,async (req, res) =>{
    try {
        const notes = await Notes.find({user: req.user.id})
        res.json(notes);
       
    }  catch (error) {
        // loging error's message
        console.error(error.message);
        // returning back bad request status
        res.status(500).send("Internal server error fro get user");
      }
})
router.post("/addnotes", fetchUser , [
    body("title", "title must be 3 character").isLength({min: 3}),
    // password will not be blank
    body("description", "description must be 5 character").isLength({min: 5}),
] ,async (req, res) =>{
    try {
        const errors = validationResult(req);
        // this line ensure there no error in above validator and post request obey the above code
        if (!errors.isEmpty()) {
          // retrun if there is an error, the request is return an array of json of error and 400 bad request
          return res.status(400).json({ errors: errors.array() });
        }
        let {title, description, tag } = req.body;
        const notes = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNotes = await notes.save();
        res.json(savedNotes);
    } catch (error) {
        // loging error's message
        console.error(error.message);
        // returning back bad request status
        res.status(500).send("Internal server error fro get user");
      }
   
   
})


module.exports = router;