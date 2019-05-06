var User = require('../models/user.js');
var Message = require('../models/message.js');


const nodemailer = require('nodemailer');
var jwt = require("jsonwebtoken");
var path = require('path');
const config = require('../config/mongoose.js');
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const passport = require('../config/passport.js');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;




module.exports = {

oneUser: function(req, res, next){
    const id = req.params.id;
    User.findById(id).populate('blockeds').populate('chats').populate({path:'chats', populate:{path:'user', model:User}}).populate({path:'chats', populate:{path:'messages', model:Message}}).exec(function(err, user){
        if(err){
            return res.json({succes: false, msg: err}); 
        }else{
            return res.json({succes: true, user: user});
        }
    })
},
oneUserByEmail: function(req, res, next){
    const email = req.params.id;
    User.findOne({_id: email}).populate('blockeds').populate('chats').populate({path:'chats', populate:{path:'user', model:User}}).exec(function(err, user){
        if(err){
            return res.json({succes: false, msg: err}); 
        }else{
            return res.json({succes: true, user: user});
        }
    })
},
findAnuser: function(req, res, next){
    const email = req.body.search;
    // console.log(email)
    User.findOne({email: email}).exec(function(err, user){
        if(!user){
            return res.json({notfound: true});  
        }
        else if(err){
            return res.json({succes: false, msg: err});   
        }else{
            return res.json({succes: true, user: user});
        }
    })
},

invite: function(req, res, next){
    const email = req.body.email;
    const id = req.params.id;
    console.log('here1')
    User.findById(id, function(err, user){
        
        if(err){
            return res.json({succes: false, msg: err});
        }else{
            const name = user.first_name;
            const url1 = user.url
            console.log(name)
            
                let newuser = new User({
                    email : email
                });
                User.addUser(newuser, (err, neuser)=>{
                    if(err){
                        return res.json({succes: false, msg: err});
                    }else{
                        // return res.json({succes: true, user: user});
                

                        let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: '', // generated ethereal user
                                pass: ''// generated ethereal password
                            }
                        });
                        const url = 'http://localhost:4000/users/'+neuser._id+'/invited/'+id;
                        let mailOptions = {
                            from: '"Lets chat 👻" <interact@interact.com>', // sender address
                            to: email,
                            subject: 'You invited by a friend!', // Subject line
                            text: 'Please click this link and confirm your email.', // plain text body
                            html: '<img src="'+url1+'"><br><p>'+name+ ' wants to chat with you! By clicking the link you can accept invitation and chat.</p> <br> <a  href="'+url+'" > click and confirm your email! </a>' 
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);
                            // Preview only available when sending through an Ethereal account
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
                        });
                        res.json({succes: true, msg:'succesfully invited'})
            
                    }
                })
            }
    })

},
registerNew: function(req, res, next){
    const id = req.params.id;
    User.findOne({email: req.body.email}, function(err, user){
        if(err) throw err;
        let newChat = new Chat({
        });
        newChat.user.push(user_id);
        newChat.user.push(id);
        newChat.save((err)=>{;
            if(err){
                return res.json({succes: false, msg: err});  
            }else{
                user.update({first_name: req.body.first_name, last_name: req.body.last_name, url: req.body.url, googleId: req.body.googleId});
                user.chats.push(newChat);
                user.save(function(err, user){
                    if(err){
                        return res.json({succes: false, msg: err}); 
                    }else{
                        const token = jwt.sign({data: user}, config.secret, {
                            expiresIn: 604800 
                        });
                        res.json({

                            success: true,
                            token: 'JWT '+token,
                            user:user
                
                        })
                    }
                })
            }
        });
    });
},

    // register
register: function(req, res, next ){
        User.findOne({googleId: req.body.googleId}, function(err, user){
            if(err) throw err;
            if(!user){
                let newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    googleId: req.body.googleId,
                    url: req.body.url

                });
                User.addUser(newUser, (err, user)=>{
                    if(err){
                        return res.json({succes: false, msg: err});
                    }else{
                        return res.json({succes: true, user: user});
                    }
                })
            }else{
                if(user.email === req.body.email && user.first_name === req.body.first_name && user.last_name === req.body.last_name && user.photo === req.body.url){
                    const token = jwt.sign({data: user}, config.secret, {
                        expiresIn: 604800 
                    });
                    res.json({

                        success: true,
                        token: 'JWT '+token,
                        user:user
            
                    })
                }else{
                    user.update({first_name: req.body.first_name, last_name: req.body.last_name, url: req.body.url, email: req.body.email});
                    user.save(function(err, user){
                        if(err){
                            return res.json({succes: false, msg: err}); 
                        }else{
                            const token = jwt.sign({data: user}, config.secret, {
                                expiresIn: 604800 
                            });
                            res.json({
        
                                success: true,
                                token: 'JWT '+token,
                                user:user
                    
                            })
                        }
                    })
                }
            }
        });
},
block: function(req, res, next){
    const user_id = req.params.user_id;
    const adm_id = req.params.adm_id;
    User.findById(user_id).exec((err, user)=>{
        if(err){
            return res.json({succes: false, msg: err});  
        }else{
            user.blockeds.push(adm_id);
            user.save((err)=>{
                if(err){
                    return res.json({succes: false, err: err}); 
                }else{
                    return res.json({succes: true, msg: 'success!'}); 
                }
            })
            
        }
    })
},
unblock: function(req, res, next){
    const user_id = req.params.user_id;
    const adm_id = req.params.adm_id;
    User.findById(user_id).exec((err, user)=>{
        if(err){
            return res.json({succes: false, msg: err});  
        }else{
            user.blockeds.pull(adm_id);
            user.save((err)=>{
                if(err){
                    return res.json({succes: false, err: err}); 
                }else{
                    return res.json({succes: true, msg: 'success!'}); 
                }
            })
            
        }
    })
},

destroy: function(req, res, next){
    const id = req.params.id;
    User.findByIdAndRemove(id).exec((err)=>{
        if(err){
            return res.json({succes: false, msg: err});  
        }else{
            return res.json({succes: true, msg: 'success!'}); 
        }
    })
},



}
