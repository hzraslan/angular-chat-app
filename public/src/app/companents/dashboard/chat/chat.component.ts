import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import { UsersService } from '../../../services/users.service'
import { ChatService } from '../../../services/chat.service'
import { Auth1Service } from '../../../services/auth1.service'
import {ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';

import { UploadService } from '../../../services/upload.service'

import { ValidateService } from '../../../services/validate.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import { runInThisContext } from 'vm';

import * as moment from 'moment';



import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Route } from '../../../../../node_modules/@angular/compiler/src/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('#scrollMe') private myScrollContainer: ElementRef;

  constructor(private _authService: Auth1Service,
              private _chatService: ChatService,
              private _usersService: UsersService,
              private _route: ActivatedRoute,
              private _router: Router,
              private _uploadService: UploadService,
              private _flashMessagesService: FlashMessagesService) {  }

    user:any;
    id:any;
    // responder:any;
    chat:any;
    adm:any;
    picture:any;
    comment:any;
    // newUrl:any;
    newUrl1:any;
    data1:any;
    key:any;
    candoChat:boolean =true;
    userblocked:boolean = false;
   


  ngOnInit() {
    this._authService.getProfile().subscribe(profile =>{
      this.user = profile['user'];
      // console.log(this.user);
      this._route.params.subscribe((params : Params)=>{
        this.id = params['id']
        // console.log(this.id)
        let tempObservable2 = this._chatService.getaChat(this.id);
        tempObservable2.subscribe(data=> {
          this.chat = data['chat'];
          // console.log(this.chat);
          for(var i = 0; i < this.chat.user.length; i++){
            if(this.chat.user[i]._id != this.user._id){
              this.adm = this.chat.user[i];
              this.userBlocked();
              for(var k = 0; k< this.adm.blockeds.length; k++){
                if(this.adm.blockeds[k]._id === this.user._id){
                  this.candoChat = false;
                }
              }
              
            }
          }
          
          
          setInterval(() => { 
            if(this.userblocked === false){
            let observable1 = this._chatService.getaChat(this.id);
            observable1.subscribe(data=>{
              this.chat = data['chat'];
              const b = this.chat.messages;
              var ids = [];
              for(var i = 0; i< b.length; i++){
                if(b[i].commentor._id === this.adm._id && b[i].seen === 0){
                  ids.push(b[i]._id);
                }
              }
              // console.log(ids)
              const see ={
                seen: ids
              }
              if(ids.length > 0){
              this.seenOnOpen(this.adm._id, this.chat._id, see);
              }
            })
          }
          }, 5000);
        

        })
      })
    },
    
    err =>{
      return false;
    });
    
  
   


    this.scrollToBottom();
    this._router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
  

   
    
  }

  ngAfterViewChecked() {
 
    this.scrollToBottom(); 
    
     
      
}
stringAsDate(dateStr: any) {
  return moment().from(dateStr);
}
scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrolldown = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}

// Block

userBlocked(){
  for(var a = 0; a < this.user.blockeds.length; a++){
    if(this.user.blockeds[a] === this.adm._id){
      this.userblocked =true;
      // return true;
    }
  }
}

blockUser(){
  this._usersService.serviceBlockUser(this.adm, this.user).subscribe(data=>{
    if(data['succes']){
      this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
      location.reload();
    }else{
      this._flashMessagesService.show(data['err'], {cssClass:'alert-danger', timeout: 4000});
    }
  })
}
// Chat

sendChat1(adm, event){
  if(event.keyCode == 13) {
    this.sendChat(adm);
  }
}


sendChat(adm){
  if(this.newUrl1){
    let chat ={
      comment: this.comment,
      url: this.newUrl1,
      key: this.key
  
    }
      let observable = this._chatService.servicePostChat(this.user._id, this.id, chat);
      observable.subscribe(data=>{
        let observable1 = this._chatService.getaChat(this.id);
        observable1.subscribe(data=>{
          this.chat = data['chat'];
          // 
          this.comment ='';
          
          this.newUrl1 = null;
          this.key = null;
          this.picture = null;
        })
      })
  }else{
  let chat ={
    comment: this.comment,

  }
    let observable = this._chatService.servicePostChat(this.user._id, this.id, chat);
    observable.subscribe(data=>{
      let observable1 = this._chatService.getaChat(this.id);
      observable1.subscribe(data=>{
        this.chat = data['chat'];
        // 
        this.comment ='';
        
        
      })
    }) 
  }
}


removeMessage(message){
  if(message.img){
    var params = {
      Bucket:  'mynewspaper',
      Key: message.img.key
     };
     this._uploadService.bucket.deleteObject(params, function(err, data) {
       if (err) console.log(err, err.stack); 
      
     });
     this._chatService.removeMessage(message._id, message.img._id).subscribe(data=>{
       console.log(data)
     })
    
  }else{
    this._chatService.removeOnlyMessage(message._id).subscribe(data=>{
      console.log(data)
    })
  }
}

// seen

seenOnOpen(id1, id2, seen){
  let observable = this._chatService.serviceSeen(id1, id2, seen);
  observable.subscribe(data=>{
    // console.log(data);
  })
}

// Photo 

  onFileSelected(event){
    this.picture = event.target.files[0];
  }
  
  onload() {
    const file = this.picture;
    this.uploadfile(file);
    
  }
  // convertURl(url, data){
  //   this.newUrl1 = url;
  //   this.data1 = data;
  //   console.log(this.data1)
  // }




  uploadfile(file) : void{
  
  
    const params = {
      Bucket: 'mynewspaper',
      Key: this._uploadService.ChatFOLDER + 'chat/'+ this.user.first_name + this.adm.first_name +new Date(),
      Body: file,
      ContentType: 'image/png'
    };
    
    this._uploadService.bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
 
      return true;
    });
    this.key = this._uploadService.ChatFOLDER + 'chat/'+ this.user.first_name + this.adm.first_name +new Date(),
    this.newUrl1 = ''+ this.user.first_name + this.adm.first_name +new Date();
    console.log(this.newUrl1);
  }


}
