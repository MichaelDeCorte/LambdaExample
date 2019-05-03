import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import {
    HttpClientTestingModule,
    HttpTestingController
       } from '@angular/common/http/testing';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EnvironmentService]
        });
    });

    it('should be initialized',
       inject([EnvironmentService], 
              (environmentService: EnvironmentService) => {
                  expect(environmentService).toBeTruthy();
              }
             )
      );

    it('should get environment',
       fakeAsync(
           inject([EnvironmentService, HttpTestingController], 
                  (environmentService: EnvironmentService, http: HttpTestingController) => {
                      const url = '/assets/environment.dev.json';
                      const responseObject = {
                          "apiEndPoints": {"party":{"endpoint":"/party"}},
                          "apiInvokeUrl": "https://dh9qp202xf.execute-api.us-east-1.amazonaws.com/dev-stage",
                          "cognitoUserPoolId": "us-east-1_JQpUwdflR",
                          "cognitoClientId": "7it5nphstn03r67faklvdjsd33",
                          "cognitoUrl": "https://thirdsource.auth.us-east-1.amazoncognito.com",
                          "loginUrl": "https://thirdsource.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=7it5nphstn03r67faklvdjsd33&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fsecurity%2Fauthenticate",
                          "region": "us-east-1"
                      };

                      environmentService.initialize();

                      const requestWrapper = http.expectOne({url: url});
                      requestWrapper.flush(responseObject);
                      tick();

                      let config = environmentService.getConfig();

                      expect(config).toBeTruthy();
                      expect(config).toEqual(responseObject);
                  }
                 )
       )
       );
});
