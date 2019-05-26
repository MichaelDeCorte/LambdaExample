import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, AuthorizationToken } from './auth/auth.service';
import { AuthMockService } from './auth/authMock.service';
import { CognitoService } from './cognito/cognito.service';
import { CognitoMockService } from './cognito/cognitoMock.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
    ],
    providers: [
        AuthService,
        AuthMockService,
        CognitoService,
        CognitoMockService,
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
        // console.log('SecurityModule.ngOnDestroy');
    }
}

export { AuthService, AuthorizationToken } from './auth/auth.service';
export { AuthMockService } from './auth/authMock.service';
export { AuthGuardService } from './auth-guard/auth-guard.service';
