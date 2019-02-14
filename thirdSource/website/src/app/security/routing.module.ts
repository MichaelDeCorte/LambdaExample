import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiModule, LoginComponent, AuthenticateComponent } from './ui.module';
import { AuthGuardService } from './auth-guard/auth-guard.service';
import { AuthResolveService } from './auth-resolve/auth-resolve.service';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'authenticate',
      component: AuthenticateComponent,
      resolve: { authorizationToken: AuthResolveService },
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        UiModule
    ],
    declarations: [
    ],
    exports: [
        RouterModule,
    ],
    providers: [
        AuthResolveService
    ]
})
export class RoutingModule { }

