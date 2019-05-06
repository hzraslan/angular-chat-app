var mongoose = require('mongoose');
const config = require('../config/mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var MessageSchema = new mongoose.Schema({

    comment:{type:String},
     commentor:{ type: Schema.Types.ObjectId, ref: 'User' }, 
     img:{type: Schema.Types.ObjectId, ref: 'Image'},
     seen:{type:Number, default:0}
    },
    
    {timestamps: true});

module.exports =  mongoose.model('Message', MessageSchema)
var Message = mongoose.model('Message', MessageSchema);