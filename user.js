const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    name : {type : String , required : [true ,'Name need to be there.']},
    email : {type : String, required : [true ,'Email need to be there.'] , unique : [true ,'Email need to be unique.']},
    password : {type : String , required : [true ,'Password need to be there.']}
})
module.exports = mongoose.model('user', userSchema);