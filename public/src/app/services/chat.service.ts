import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _httpClient: HttpClient) { }

 getaChat(id){
  //  console.log(id)
  return this._httpClient.get('/api/hspb/chat/'+id);
 }
 serviceStartChat(user, adm){
  return this._httpClient.post('/api/hspb/chats/'+user._id+'/startachat/'+adm._id, adm);
 }
 servicePostChat(user_id, chat_id, chat){
  return this._httpClient.post('/api/hspb/'+user_id+'/chats/'+chat_id+'/post', chat);
 }
 serviceRemoveChat(id){
  return this._httpClient.delete('/api/hspb/chats/'+id);
 }
 serviceSeen(id1, id2, seen){
  //  console.log(seen)
  return this._httpClient.put('/api/hspb/chats/'+id1+'/seen/'+id2, seen);
 }
 removeMessage(message_id, img_id){
  
  return this._httpClient.delete('/api/hspb/chats/remove/'+message_id+'/remove/'+img_id);
 }
 removeOnlyMessage(message_id){
  return this._httpClient.delete('/api/hspb/chats/remove/message/'+message_id);
 }
}
