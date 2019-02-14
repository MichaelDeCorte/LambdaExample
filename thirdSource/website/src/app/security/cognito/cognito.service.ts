import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthorizationToken, AuthService } from '../auth/auth.service';

var uri: string = 'https://thirdsource.auth.us-east-1.amazoncognito.com/';
var clientId: string = '72hos29ntil5e8ludtvkrh0uus';
// var loginRedirectUri: string = 'https://localhost:4200/security/authenticate';
var loginRedirectUri: string = 'http://localhost:4200/security/authenticate';
var loginRedirectUriEncoded: string = encodeURIComponent(loginRedirectUri);

var logoutRedirectUri: string = 'http://localhost:4200/security/login';
// var logoutRedirectUri: string = 'https://localhost:4200/home';
var logoutRedirectUriEncoded: string = encodeURIComponent(logoutRedirectUri);


@Injectable(
    { providedIn: 'root' }
)

export class CognitoService {

    constructor(private http: HttpClient,
                private authService: AuthService) {
        console.log('CogitoService.constructor');
    }

    static getAuthenticateUrl(): string {
        return uri +
            '/login?response_type=code' +
            '&client_id=' + clientId +
            '&redirect_uri=' + loginRedirectUriEncoded;
    }

    getToken(code: string): Observable<AuthorizationToken> {
        let url = uri + 'oauth2/token';


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
    }

    logout() {
        let url = uri + 'logout?';

        
        let headers = this.authService.getAuthorizationHeaders();

        console.log('headers: ' + JSON.stringify(headers));

        let httpOptions = {
//            headers: headers,
            params: new HttpParams()
                .set('logout_uri', logoutRedirectUri)
                .set('client_id', clientId)
        };

        return this.http.get(url, httpOptions);
    }
}

