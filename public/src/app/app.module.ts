import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {ValidateService} from './services/validate.service';
import {Auth1Service} from './services/auth1.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
// import { AuthService, AppGlobals } from 'angular2-google-login';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IndexComponent } from './companents/index/index.component';
import { UsersService } from './services/users.service';
import { DeportGuard } from './guards/deport.guard';
import { DashboardComponent } from './companents/dashboard/dashboard.component';



import { ChatComponent } from './companents/dashboard/chat/chat.component';
import { BlankComponent } from './companents/dashboard/blank/blank.component';
import { InvitedComponent } from './companents/invited/invited.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DashboardComponent,
    ChatComponent,
    BlankComponent,
    InvitedComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [AuthGuard, UsersService, DeportGuard, ValidateService, Auth1Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
