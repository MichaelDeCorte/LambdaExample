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
            "apiInvokeUrl": "https://xxx-api.us-east-1.amazonaws.com/dev-stage",
            "cognitoUserPoolId": "us-east-xxx",
            "cognitoClientId": "7it5nphstn03r67faklvdjsd33",
            "cognitoUrl": "https://thirdsource.auth.us-east-1.amazoncognito.com",
            "loginUrl": "https://thirdsource.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=xxx&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fsecurity%2Fauthenticate",
            "region": "us-east-1"
        };
    }
}

