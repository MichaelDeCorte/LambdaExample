// this module is here to avoid a dependency loop with the lazy loaded routing module
// https://stackoverflow.com/a/49889069

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LoginComponent,
        AuthenticateComponent,
    ],
    exports: [
        LoginComponent,
        AuthenticateComponent,
    ]
})
export class UiModule { }

export { LoginComponent, AuthenticateComponent };
