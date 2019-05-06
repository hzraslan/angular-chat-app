var users = require('../controllers/users.js');
var chats = require('../controllers/chats.js');
var path = require('path');
const config = require('../config/mongoose.js');
var passport = require('passport');
require('./passport')(passport)

module.exports = function(app){

    app.post('/api/hspb/register', (req, res, next)=>{
        users.register(req, res, next);
    });
    app.post('/api/hspb/register/id', (req, res, next)=>{
        users.registerNew(req, res, next);
    });

    app.get('/api/hspb/users/:id', (req, res, next)=>{
        users.oneUser(req, res, next);
    });
    // app.get('/api/hspb/users/hi/hi', (req, res, next)=>{
    //     res.send('hi')
    // });

    app.get('/.well-known/acme-challenge/DUZW-PQw6_xt-kb7Q496P7QrQnijXXfMFbgi7hh-UKk', (req, res, next)=>{
       res.send("DUZW-PQw6_xt-kb7Q496P7QrQnijXXfMFbgi7hh-UKk.5Aw91aFZj7I4yUBhIZ4xruwKHjw7CV7LV0-8L6ng2Cs");
   });
    app.get('/api/hspb/users/email/:id', (req, res, next)=>{
        users.oneUserByEmail(req, res, next);
    });
    app.get('/api/hspb/profile', passport.authenticate('jwt', {session: false}),  (req, res, next)=>{
        res.json({user: req.user});
      });

    app.delete('/api/hspb/users/:id/delete', (req, res, next)=>{

        users.destroy(req, res, next);
    });
    app.post('/api/hspb/users/find', users.findAnuser);

    app.post('/api/hspb/users/:id/invite', users.invite);

    app.get('/api/hspb/chats/:id', chats.myChats);

    app.get('/api/hspb/chats/delete/:id', chats.destroy);

    app.delete('/api/hspb/chats/remove/:message_id/remove/:img_id', function(req, res, next){
        // console.log('here')
        chats.destroyMessage(req, res, next);
    });
    app.delete('/api/hspb/chats/remove/message/:message_id', function(req, res, next){
        // console.log('here')
        chats.destroyonlyMessage(req, res, next);
    });

    app.get('/api/hspb/chat/:chat_id', function(req, res, next){
        // console.log('here')
        chats.oneChat(req, res, next);
    });

    app.post('/api/hspb/:user_id/chats/:chat_id/post', chats.message);

    app.post('/api/hspb/chats/:user_id/startachat/:resp_id', chats.createAchat);

    app.put('/api/hspb/chats/:user_id/seen/:chat_id', chats.seen);


    app.put('/api/hspb/users/:user_id/block/:adm_id', users.block);

    app.put('/api/hspb/users/:user_id/unblock/:adm_id', users.unblock);


}
