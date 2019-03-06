import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

var authorizationToken: AuthorizationToken;
var authorizationCode: string;
var authorizationHeaders: HttpHeaders;

export interface AuthorizationConfig {
}

export class AuthorizationToken {
    id_token: string;
    access_token: string;
    refresh_token: string;
}

@Injectable(
    { providedIn: 'root' }
)

export class AuthService {

    constructor() {
    }

    ngOnDestroy() {
    }

    // oauth2 code
    setAuthorizationCode(code: string) {
        authorizationCode = code;
    }

    getAuthorizationCode(): string {
        return authorizationCode;
    }

    // oauth2 token
    setAuthorizationToken(token: AuthorizationToken) {
        if ((token === null) || (token === undefined)) {
            authorizationHeaders = null;
        } else {
            authorizationHeaders = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', token.id_token);
        }
        authorizationToken = token;
    }

    // oauth2 headers??
    getAuthorizationToken(): AuthorizationToken {
        console.log('auth.service.getToken authorizationToken: ' + authorizationToken);
        return authorizationToken;
    }    

    // has the user logged in?
    isAuthenticated(): boolean {
        return (authorizationToken != null) && (authorizationToken != undefined);
    }

    getAuthorizationHeaders(): HttpHeaders {
        return authorizationHeaders;
    }
}
