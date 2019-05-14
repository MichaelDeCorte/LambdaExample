import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';

@Injectable({
    providedIn: 'root'
})

export class EnvironmentMockService extends EnvironmentService {

    async getConfigFile() {
        
        // console.log("EnvironmentMockService.getConfigFile");
        
        return {
            "apiEndPoints": {"party":{"endpoint":"/party"}},
            "apiInvokeUrl": "https://mock-invoke-url",
            "cognitoUserPoolId": "mock-user-pool-id",
            "cognitoClientId": "mock-client-id",
            "cognitoUrl": "https://mock-cognito-url",
            "loginUrl": "https://mock-login-url/login?response_type=code&client_id=xxx&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fsecurity%2Fauthenticate",
            "region": "us-east-1"
        };
    }
}

