import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {DeportGuard} from './guards/deport.guard';

import {CanActivate, Router } from '@angular/router';

import { IndexComponent } from './companents/index/index.component';
import { DashboardComponent } from './companents/dashboard/dashboard.component';


import { ChatComponent } from './companents/dashboard/chat/chat.component';
import { BlankComponent } from './companents/dashboard/blank/blank.component';
import { InvitedComponent } from './companents/invited/invited.component';



const routes: Routes = [
    { path: '',component: IndexComponent, canActivate:[DeportGuard]},
    { path: 'dashboard',component: DashboardComponent, canActivate:[AuthGuard], children:[
        {path:'', component: BlankComponent, canActivate:[AuthGuard]},
        {path: 'chat/:id', component: ChatComponent, canActivate:[AuthGuard]}
    ]},
    {path:'users/:id1/invited/:id2', component:InvitedComponent},
    // { path: '**', component: IndexComponent, canActivate:[DeportGuard] },


];

@NgModule({
imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
exports: [RouterModule]
})
export class AppRoutingModule { }
