import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { EnvironmentService, EnvironmentMockService } from '../../shared/shared.module';
import { AuthorizationToken, AuthService, AuthMockService } from '../../security/security.module';

import { CognitoService } from './cognito.service';

describe('CognitoService', () => {

    let environmentService: EnvironmentService;
    let cognitoService: CognitoService;
    let http: HttpTestingController;
    let config: any;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            declarations: [ ],
            imports: [HttpClientTestingModule],
            providers: [
                CognitoService,
                {provide: AuthService, useClass: AuthMockService},
                {provide: EnvironmentService, useClass: EnvironmentMockService},
            ],
        });

        environmentService = TestBed.get(EnvironmentService);        
        await environmentService.initialize();           
        config  = environmentService.getConfig();

        http = TestBed.get(HttpTestingController);
        cognitoService = TestBed.get(CognitoService);
    });

    it('should be created', 
       () => {
           expect(cognitoService).toBeTruthy();
       });

    using(testData, (data) => {
        it('should be created',
           fakeAsync(() => {
               let authenticateUrl = cognitoService.getAuthenticateUrl();
               expect(authenticateUrl).toEqual(data.result.authenticateUrl);

               let logoutUrl = cognitoService.getLogoutUrl();
               expect(logoutUrl).toEqual(data.result.logoutUrl);

               let token: AuthorizationToken;
               cognitoService.getToken(data.code).subscribe(
                   (t) => {
                       token = t;
                       expect(token).toEqual(data.result.token)
                   }
               );
               const request = http.expectOne({url: config.cognitoUrl + '/oauth2/token'});
               request.flush(data.result.token);
	           tick();
           })
          )
    });
});
