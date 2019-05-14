import { Injectable } from '@angular/core';
import { AuthorizationToken, AuthService } from './auth.service'; 

@Injectable(
    { providedIn: 'root' }
)

export class AuthMockService extends AuthService{
    constructor() {
        let token: AuthorizationToken;
        
        super();

        super.setAuthorizationCode('authorizationCode');
        
        token = new AuthorizationToken();
        token.id_token = 'id_token_mock';
        token.access_token = 'access_token_mock';
        token.refresh_token = 'refresh_token_mock';
        super.setAuthorizationToken(token);
    }
}
