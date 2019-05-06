import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { Auth1Service } from '../../services/auth1.service'
import { ValidateService } from '../../services/validate.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from '../../services/users.service'
declare const gapi: any;
@Component({
  selector: 'app-invited',
  templateUrl: './invited.component.html',
  styleUrls: ['./invited.component.css']
})
export class InvitedComponent implements OnInit, AfterViewInit {
  id1:any;
  id2:any;
  user:any;
  inviter:any;
  ignored:boolean=false;
  displaylogin:boolean= false;


  constructor(private _authService: Auth1Service,
    private _flashMessagesService: FlashMessagesService,
    private _validateService: ValidateService,
    private _usersService: UsersService,
    private _router: Router,
    private _route: ActivatedRoute,) { }
    public auth2: any;
    public googleInit() {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.attachSignin(document.getElementById('googleBtn'));
      });
    }
    public attachSignin(element) {
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {
  
          let profile = googleUser.getBasicProfile();
          let token = googleUser.getAuthResponse().id_token;
          const user ={
            first_name: profile.ofa,
            last_name: profile.wea,
            email: profile.U3,
            googleId: profile.Eea,
            url: profile.Paa
            
          }
          let observable = this._authService.registerNewUser(user, this.inviter);
          observable.subscribe(data => {
           if(data['success']){
            this._authService.storeUserData(token, data['user'], data['token']);
            this._flashMessagesService.show('Successfully logged in!', {cssClass:'alert-success', timeout: 4000});
            this._router.navigate(['/dashboard']);
           }else{
            this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
            
           }
          });
          
         
          
  
  
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
    }
  
  ngAfterViewInit(){
        this.googleInit();
  }
  

  ngOnInit() {
    this._route.params.subscribe((params : Params)=>{
      this.id1 = params['id1']
      this.id2 = params['id2']
      let tempObservable2 = this._usersService.getanUserByEmail(this.id1);
      tempObservable2.subscribe(data=> {
        if(data['succes']){
         
            this.user = data['user'];
            console.log(this.user)
            if(this.user.first_name){
              this.ignored = true;
            }
      
        }else{
          this.ignored = true;
        }
        

      })
      this._usersService.getanUser(this.id2).subscribe(data=>{
        this.inviter = data['user'];
        console.log(this.inviter)
      })
    })
  }
  removeUser(){
    this._usersService.removeUserFromService(this.user).subscribe(data=>{
      this._router.navigate(['/']);
    })
  }

}
