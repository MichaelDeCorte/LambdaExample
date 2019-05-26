import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthorizationToken, AuthService } from '../auth/auth.service';
import { EnvironmentService } from '../../shared/shared.module';

var clientId; 

var loginRedirectUri: string = location.origin + '/security/authenticate';
var loginRedirectUriEncoded: string = encodeURIComponent(loginRedirectUri);
var logoutRedirectUri: string = location.origin + '/home';
var logoutRedirectUriEncoded: string = encodeURIComponent(logoutRedirectUri);


@Injectable(
    { providedIn: 'root' }
)

export class CognitoMockService {

    private config;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private environmentService: EnvironmentService
               ) {
    }

    getAuthenticateUrl(): string {
        return "https://mock-cognito-url/login?response_type=code&client_id=mock-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A9876%2Fsecurity%2Fauthenticate";
        // return testData[0].result.authenticateUrl;
    }

    getToken(code: string): Observable<AuthorizationToken> {
        return of({
            "id_token": "id_token_value",
            "access_token": "access_token_value",
            "refresh_token": "refresh_token_value"
        });
        // return Observable.of(testData[0].result.token);
    }
    

    getLogoutUrl(): string {
        return "https://mock-cognito-url/logout?response_type=code&client_id=mock-client-id&logout_uri=http%3A%2F%2Flocalhost%3A9876%2Fhome";
        // return testData[0].result.logoutUrl;
    }
}

