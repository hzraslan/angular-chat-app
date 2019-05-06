import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }
  validateRegister(user){
    if(user.first_name == undefined || user.last_name == undefined ||user.email == undefined  || user.password == undefined){
      return false;
    }else{
      return true;
    }
  }
  validatePasswordchange(body, confirm_password, confirm_newPassword){
    if(body.password == undefined || confirm_password == undefined || confirm_newPassword == undefined || body.newPassword == undefined){
      return false;
    }else{
      return true;
    }
  }
  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  matchPassword(password, confirmation){
    if(password === confirmation){
      return true;
    }else{
      return false;
    }
  }
}