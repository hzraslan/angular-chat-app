var User = require('../models/user.js');

var path = require('path');


var Chat = require('../models/chat.js');
var Message = require('../models/message.js');
var Image = require('../models/image.js');

const config = require('../config/mongoose.js');
module.exports = {
    myChats: function(req, res, next){
        const id = req.params.id;
        User.findById(id).populate('user').populate({path:'messages',populate:{path:'commentor', model: 'User'}}).populate( {path: 'messages', populate:{path:'img', model:'Image'}}).exec( function(err, user){
            if(err){
                return res.json({succes: false, msg: err});
            }else{
                Chat.find({user: user}, function(err, chats){
                    if(err){
                        return res.json({succes: false, msg: err});  
                    }else{
                        return res.json({succes: true, chats: chats});  
                    }
                });
            }
        });
    },
    oneChat: function(req, res, next){
        const id = req.params.chat_id;
        // console.log(id);
        Chat.findById(id).populate('user').populate({path:'messages',populate:{path:'commentor', model: 'User'}}).populate( {path: 'messages', populate:{path:'img', model:'Image'}}).exec((err, chat)=>{
            if(err){
                return res.json({succes: false, msg: err});  
            }else{
                return res.json({succes: true, chat: chat});  
            }
        })
    },
    createAchat: function(req, res, next){
        const user_id = req.params.user_id;
        const resp_id = req.params.resp_id;
        Chat.findOne( {$and: [{user: user_id}, {user: resp_id}]}).exec((err, chat)=>{
            if(!chat){
                let newChat = new Chat({
                });
                newChat.user.push(user_id);
                newChat.user.push(resp_id);
                newChat.save((err)=>{;
                    if(err){
                        return res.json({succes: false, msg: err});   
                    }else{
                        User.findById(user_id, function(err, user){
                            if(err){
                                return res.json({succes: false, msg: err});   
                            }else{
                                user.chats.push(newChat);
                                user.save();
                                User.findById(resp_id, function(err, responder){
                                    if(err){
                                        return res.json({succes: false, msg: err});   
                                    }else{
                                        responder.chats.push(newChat);
                                        responder.save();
                                        return res.json({succes: true, chat: newChat});
                                    }
                                })
                            
                                // return res.json({succes: true, chat: newChat});
                            }
                        })
                        
                    }
                })
            }else{
               
                return res.json({succes: true, chat: chat}); 
            }
        })
    },


    message: function(req, res, next){
        const chat_id = req.params.chat_id;
        const user_id = req.params.user_id;
        Chat.findById(chat_id, function(err, chat){
            if(err){
                return res.json({succes: false, msg: err});  
            }else{
                if(req.body.url){
                    var img = new Image({url: req.body.url, key: req.body.key});
                    img.save(function(err, img){
                        if(err){
                            return res.json({succes: false, msg: err}); 
                        }else{
                        var message = new Message({comment: req.body.comment, commentor: user_id, img: img._id});
                        
                        message.save(function(err, message){
                            if(err){
                                return res.json({succes: false, msg: err}); 
                            }else{
                                chat.messages.push(message);
                                chat.save((err)=>{
                                    if(err){
                                        return res.json({succes: false, msg: err});
                                        }else{
                                            return res.json({succes: true, msg: 'success'}); 
                                        }
                                })
                            }
                        })
                    }
                })
                }else{
                    var message = new Message({comment: req.body.comment, commentor: user_id});
                    message.save(function(err, message){
                        if(err){
                            return res.json({succes: false, msg: err}); 
                        }else{
                            chat.messages.push(message);
                            chat.save((err)=>{
                                if(err){
                                    return res.json({succes: false, msg: err});
                                    }else{
                                        return res.json({succes: true, msg: 'success'}); 
                                    }
                            })
                        }
                    })
            }
            }
        })
         
    },


    destroy: function(req, res, next){
        const id = req.params.id;
        Chat.findById(id).remove().exec((err)=>{
            if(err){
                return res.json({succes: false, msg: err});    
            }else{
                return res.json({succes: true, msg: "success!"});  
            }
        })
    },
    destroyMessage: function(req, res, next){
        const message_id = req.params.message_id;
        const img_id = req.params.img_id;
      
        Message.findByIdAndRemove(message_id).exec((err)=>{
            if(err){
                return res.json({succes: false, msg: err});    
            }else{
                Image.findByIdAndRemove(img_id).exec((err)=>{
                    if(err){
                        return res.json({succes: false, msg: err});    
                    }else{
                        return res.json({succes: true, msg: "success!"});  
                    }
                })
            }
        })
    },
    destroyonlyMessage: function(req, res, next){
        const message_id = req.params.message_id;
        
       
        Message.findByIdAndRemove(message_id).exec((err)=>{
            if(err){
                return res.json({succes: false, msg: err});    
            }else{
               
                        return res.json({succes: true, msg: "success!"});  
                   
                
            }
        })
    },
    seen: function(req, res, next){
       
        // const chat_id = req.params.chat_id;
        // const user_id = req.params.user_id;
        if(req.body.seen.length < 2){
            Message.findById(req.body.seen[0], function(err, message){
                if(err){
                    return res.json({succes: false, msg: err});   
                }else{
                    message.update({seen: 1}, function(err){
                        if(err){
                            return res.json({succes: false, msg: err});
                            }else{
                                return res.json({succes: true, msg: 'success'}); 
                            }
                        });
                    }
                })
        }else{
            var ba = [];
            Message.find({_id: {$in: req.body.seen}}).exec( function(err, messages){
                if(err){
                    return res.json({succes: false, msg: err});   
                }else{
                    messages.forEach(function(message){
                        message.update({seen: 1}, function(err){
                            if(err){
                                return res.json({succes: false, msg: err});
                            }else{
                               
                               ba.push('success');

                            }
                        });
                        if(ba.length > 0){
                            return res.json({succes: true, msg: 'alright!!!'}); 
                        }
                    });
                }

            })
        }
      
    },
}