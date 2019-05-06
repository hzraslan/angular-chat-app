var mongoose = require('mongoose');
const config = require('../config/mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var ImageSchema = new mongoose.Schema({
    url:{type:String},
     key:{type:String}
    },
    
    {timestamps: true});

module.exports =  mongoose.model('Image', ImageSchema)
var Image = mongoose.model('Image', ImageSchema);