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

export class CognitoService {

    private config;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private environmentService: EnvironmentService
               ) {
        console.log('location.origin: ' + location.origin);
        this.config  = this.environmentService.getConfig();
        clientId = this.config.cognitoClientId;
    }

    getAuthenticateUrl(): string {

        return this.config.cognitoUrl +
            '/login?' +
            'response_type=code' +
            '&client_id=' + clientId +
            '&redirect_uri=' + loginRedirectUriEncoded;

    }

    getToken(code: string): Observable<AuthorizationToken> {
        try {
            let url = this.config.cognitoUrl + '/oauth2/token';


            let body = new HttpParams()
                .set('grant_type', 'authorization_code')
                .set('client_id', clientId)
                .set('redirect_uri', loginRedirectUri)
                .set('code', code);

            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/x-www-form-urlencoded'
                })
            };

            return this.http.post<AuthorizationToken>(url, body, httpOptions);
        } catch (error) {
            console.log('logout error: ' + error);
        }
    }

    getLogoutUrl(): string {

        return this.config.cognitoUrl +
            '/logout?' +
            'response_type=code' +
            '&client_id=' + clientId +
            '&logout_uri=' + logoutRedirectUriEncoded;

    }
}

