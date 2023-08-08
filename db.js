// requiring mongoose 
const mongoose = require('mongoose');
// calling main function and catch if there is any error
main().catch(err => console.log(err));
// declaring function named main and making it asynchronous
async function main() {
  // awaiting mongoose connection and log connect if the conneciton is successfull
  await mongoose.connect('mongodb://127.0.0.1:27017/iNoteBook').then(console.log("connected"));
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// exporting modules
module.exports = main;