import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class Auth1Service {
user:any;
authToken:any;
headers:any;
Gtoken: any;
  constructor(
    private _httpClient: HttpClient) { }
  
    registerUser(user){
     
      return this._httpClient.post('/api/hspb/register', user);
    }
    registerNewUser(user, inviter){
      return this._httpClient.post('/api/hspb/register/'+inviter._id, user);
    }
   
    storeUserData(token, user, token2){
      localStorage.setItem('Gtoken', token);
      localStorage.setItem('id_token', token2);
     
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
      this.authToken = token2;
      this.Gtoken = token;
    }
    logOut(){
      localStorage.clear();
      this.user = null;
      this.authToken = null;
      this.Gtoken = null;
      return true;
    }
    
    getProfile(){
      this.loadToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
      return this._httpClient.get('/api/hspb/profile', httpOptions);
    }
    loadToken(){
      const token = localStorage.getItem('id_token');
      this.authToken = token;
    }
    loggedIn() {
      return !!localStorage.getItem('id_token');
    }
 
  
  
   
}