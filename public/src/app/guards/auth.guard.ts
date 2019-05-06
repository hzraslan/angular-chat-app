import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,  Router } from '@angular/router';
import { Observable } from 'rxjs';
import {Auth1Service} from '../services/auth1.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router,
    private _authService: Auth1Service,
    private _flashMessagesService: FlashMessagesService) {}
  canActivate(): boolean{
    if(this._authService.loggedIn()){
        return true;
    }else{
        this._flashMessagesService.show("You are not allowed to go to this page, please login", {cssClass:'alert-danger', timeout: 4000});
        this._router.navigate(['/login']); 
        return false;
    }
}
}
