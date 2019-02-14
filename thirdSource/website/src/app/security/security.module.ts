import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, AuthorizationToken } from './auth/auth.service';
import { CognitoService } from './cognito/cognito.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';

console.log('security.module');

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
    ],
    providers: [
        AuthService,
        CognitoService,
        AuthGuardService
    ],
    declarations: [
    ]
})
export class SecurityModule {

    constructor (@Optional() @SkipSelf() parentModule: SecurityModule) {
        if (parentModule) {
            throw new Error(
                'SecurityModule is already loaded. Import it in the AppModule only');
        }
    }

    ngOnDestroy() {
        console.log('SecurityModule.ngOnDestroy');
    }
}

export { AuthService } from './auth/auth.service';
export { AuthGuardService } from './auth-guard/auth-guard.service';
