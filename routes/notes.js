const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Notes = require("../models/Notes");

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // loging error's message
    console.error(error.message);
    // returning back bad request status
    res.status(500).send("Internal server error fro get user");
  }
});
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "title must be 3 character").isLength({ min: 3 }),
    // password will not be blank
    body("description", "description must be 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // this line ensure there no error in above validator and post request obey the above code
      if (!errors.isEmpty()) {
        // retrun if there is an error, the request is return an array of json of error and 400 bad request
        return res.status(400).json({ errors: errors.array() });
      }
      let { title, description, tag } = req.body;
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await notes.save();
      res.json(savedNotes);
    } catch (error) {
      // loging error's message
      console.error(error.message);
      // returning back bad request status
      res.status(500).send("Internal server error fro get user");
    }
  }
);
router.put("/updatenotes/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (description) {
      newNotes.description = description;
    }
    if (tag) {
      newNotes.tag = tag;
    }
    let note = await Notes.findById(req.params.id);
    console.log(note);
    if (!note) {
      res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNotes },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    // loging error's message
    console.error(err.message);
    // returning back bad request status
    res.status(500).send("Some error occur");
  }
});

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted" });
  } catch (err) {
    // loging error's message
    console.error(err.message);
    // returning back bad request status
    res.status(500).send("Some error occur");
  }
});

module.exports = router;
