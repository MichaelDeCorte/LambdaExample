import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }  from '../home/home.component';
import { PartyListComponent }  from '../party-list/party-list.component';
import { DashboardComponent }   from '../dashboard/dashboard.component';
import { PartyComponent }  from '../party/party.component';
import { AuthGuardService } from '../security/security.module';

const routes: Routes = [
    {
        path: 'security',
        loadChildren: '../security/routing.module#RoutingModule',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
//        canActivate: [AuthGuardService]       
    },
    {
        path: 'partyList',
        component: PartyListComponent,
//        canActivate: [AuthGuardService] 
    },
    {
        path:
        'detail/:partyID',
        component: PartyComponent,
//        canActivate: [AuthGuardService] 
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
        
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        RouterModule.forRoot(
            routes
        )
    ],
    declarations: [
    ],
    entryComponents: [
    ]
})

export class AppRoutingModule { }
