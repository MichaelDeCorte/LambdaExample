import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';


import { AuthorizationToken, AuthService } from '../auth/auth.service';
import { CognitoService} from '../cognito/cognito.service';

@Injectable()
export class AuthResolveService implements Resolve <AuthorizationToken> {

    constructor(private route: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private cognitoService: CognitoService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<AuthorizationToken> {
        let authorizationCode: string;
        
        authorizationCode = route.queryParamMap.get('code');

        return this.getToken(authorizationCode);
    }

    getToken(authorizationCode): Observable<AuthorizationToken> {
        console.log('AuthResolve.5.getToken: ' + authorizationCode);
        return new Observable<AuthorizationToken>(
            (observer) => {
                console.log('AuthResolve.getToken.code: ' + authorizationCode);
                if (authorizationCode === null ||
                    authorizationCode === undefined ||
                    authorizationCode.length === 0) {
                    observer.complete();
                }
                
                this.cognitoService.getToken(authorizationCode)
                    .subscribe(
                        (token) => {
                            this.authService.setAuthorizationToken(token);
                            observer.next(token);
                            observer.complete();
                        }
                    );
            }
        );
    }
}
