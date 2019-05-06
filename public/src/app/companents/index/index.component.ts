import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Auth1Service } from '../../services/auth1.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ActivatedRoute, Params, Router } from '@angular/router';
// import { AuthService, AppGlobals } from 'angular2-google-login';
declare var gapi: any;

// declare const gapi: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
  
})


export class IndexComponent implements OnInit, AfterViewInit {
  // declare const gapi: any;
  user: any;
  
  constructor( private _authService : Auth1Service, 
    private _flashMessagesService: FlashMessagesService, 
    private _router: Router,
    ) { }

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
        let observable = this._authService.registerUser(user);
        observable.subscribe(data => {
         if(data['success']){
          this._authService.storeUserData(token, data['user'], data['token']);
          this._flashMessagesService.show('Successfully logged in!', {cssClass:'alert-success', timeout: 4000});
          this._router.navigate(['/dashboard']);
         }else{
          this._flashMessagesService.show(data['msg'], {cssClass:'alert-danger', timeout: 4000});
          this._router.navigate(['/login']);
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
    this.googleInit();
  }






}
