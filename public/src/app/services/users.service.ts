import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _httpClient: HttpClient) { }
  
  allUsers(){
     return this._httpClient.get('/api/hspb');
  }
  removeUserFromService(user){
    
    return this._httpClient.delete('/api/hspb/users/'+user._id+'/delete');
  }
  getanUser(id){
    return this._httpClient.get('/api/hspb/users/'+id);
  }
  findanUser(body){
    return this._httpClient.post('/api/hspb/users/find', body);
  }
  inviteAnUser(search, user){
    console.log('here')
    return this._httpClient.post('/api/hspb/users/'+user._id+'/invite', search);
  }
  getanUserByEmail(id1){
    return this._httpClient.get('/api/hspb/users/email/'+id1);
  }
  serviceBlockUser(adm, user){
    return this._httpClient.put('/api/hspb/users/'+user._id+'/block/'+adm._id, adm);
  }
  unblockUser(blocked, user){
    return this._httpClient.put('/api/hspb/users/'+user._id+'/unblock/'+blocked._id, blocked);
  }
}
