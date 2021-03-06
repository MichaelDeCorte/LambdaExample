import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CognitoService} from '../cognito/cognito.service';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

    constructor(private route: Router,
                private authService: AuthService,
                private cognitoService: CognitoService) {
        
    }

    ngOnInit() {
    }

    login() {
        window.location.href = this.cognitoService.getAuthenticateUrl();
    }

    logout() {
        this.authService.setAuthorizationCode(undefined);
        this.authService.setAuthorizationToken(undefined);
        window.location.href = this.cognitoService.getLogoutUrl();
    }

    loggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
    
}
