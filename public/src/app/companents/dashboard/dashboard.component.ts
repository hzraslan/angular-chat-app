import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { Auth1Service } from '../../services/auth1.service'
import { ValidateService } from '../../services/validate.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from '../../services/users.service'
import { ChatService } from '../../services/chat.service';

declare var gapi: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  user: any;
  findfriend:boolean =false;
  search:any;
  searchedUser:any;
  failedSearch:boolean =false;

  constructor(private _authService: Auth1Service,
    private _flashMessagesService: FlashMessagesService,
    private _validateService: ValidateService,
    private _usersService: UsersService,
    private _router: Router,
    private _chatService: ChatService) { }

    public auth2: any;
    public googleInit() {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        
      });
    }

  ngOnInit() {
    this._authService.getProfile().subscribe(profile =>{
      this.user = profile['user'];
        this.getauser();
    });
    this.failedSearch;
    setInterval(() => { 
      this._usersService.getanUser(this.user._id).subscribe(data=>{
        this.user = data['user'];
        // console.log(this.user)
      });

    }, 5000);

  }
ngAfterViewInit(){
    this.googleInit();
    // this.getauser();
  }
  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
     console.log('alright')
     this._authService.logOut();
      this._router.navigate(['/']);
      return false;
    })
    
  
  }
  getauser(){
    this._usersService.getanUser(this.user._id).subscribe(data=>{
      this.user = data['user'];
      console.log(this.user)
    })
  }
  findFriends(){
    
    if(this.findfriend === false){
      this.findfriend = true;
      this.searchedUser = null;
      this.search = null;
      this.failedSearch = false;
    }else{
      this.findfriend = false;
      this.searchedUser = null;
      this.search = null;
      this.failedSearch = false;
    }
    
  }
  onsubmitSearch(){
    const body ={
      search: this.search
    }
    let observable = this._usersService.findanUser(body);
    observable.subscribe(data=>{
      if(data['succes']){
        this.searchedUser = data['user'];
        console.log(this.searchedUser)
      }else if(data['notfound']) {
        this.failedSearch = true;
        // console.log(data['msg'])
      }
    })
  }
  inviteToChat(search){
    if(search === 'none'){
      this.failedSearch = false;
      this.findfriend = false;
    }else{
      const a ={
        email: search,
        url1: this.user.url,
        name: this.user.name
      }
      this._usersService.inviteAnUser(a, this.user).subscribe(data=>{
        if(data['succes']){
          // this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
          this.failedSearch = false;
          this.findfriend = false;
          console.log('alrigt')
          this.getauser()
         

        }else{
          this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
          this.failedSearch = false;
          this.findfriend = false;
        }
      })
    }
  }
  startAChat(chUser){
    this._chatService.serviceStartChat(this.user,chUser).subscribe(data=>{
      if(data['succes']){
        const chat = data['chat']
        this.getauser();
        this._router.navigate(['/dashboard/chat', chat._id])
      }else{
        this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
      }
    })
  }

  goToChat(chat){
    this.getauser();
    this._router.navigate(['/dashboard/chat', chat._id])
  }
 
  seenCount(messages: any, chat: any){
    let count = 0;
    let id:any;
    for(var j = 0; j < chat.user.length; j++){
      if(this.user._id != chat.user[j]._id){
        id = chat.user[j]._id;
      }
    }
    for(var i = 0; i < messages.length; i++){
    
      if(messages[i].commentor._id === id && messages[i].seen === 0){
        count = count+1;
      }
    }
    if(count > 0){
      return count;
    }else{
      return null;
    }
    
  }

  unblock(blocked){
    this._usersService.unblockUser(blocked, this.user).subscribe(data=>{
      this.getauser();
      location.reload();
    })
  }
}
