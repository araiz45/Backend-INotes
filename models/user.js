// requiring mongoose which an external module
const mongoose = require("mongoose");
// getting schema from mongoose
const { Schema } = mongoose;
// delcaring schema
const userSchema = new Schema({
// listing name with string and it is nessary to write
    name: {
        type: String,
        required: true
    },
// email is necassary and should have been unique
    email: {
        type: String,
        required: true,
        unique: true
    },
// password
    password: {
        type: String,
        required: true
    },
// date will obtain automatically
    date: {
        type: String,
        default: Date.now()
    },
  });
// making model which first argument is a collection and second is a schema
  const User = mongoose.model('user', userSchema)
// exporting users
  module.exports = User;