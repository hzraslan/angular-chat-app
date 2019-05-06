var mongoose = require('mongoose');

const config = require('../config/mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var UserSchema = new mongoose.Schema({
    first_name:  { type: String},
    last_name: { type: String},
    email: { type: String, unique : [true, 'email is already in use, try to log in'], minlength: 6},
    googleId: { type: String},
    url: { type: String},
    chats:[{type: Schema.Types.ObjectId, ref: 'Chat'}],
    blockeds:[{type: Schema.Types.ObjectId, ref: 'User'}]

}, {timestamps: true });

module.exports =  mongoose.model('User', UserSchema)
var User = mongoose.model('User', UserSchema);

module.exports.getUserById =function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    
            newUser.save(callback);
}


