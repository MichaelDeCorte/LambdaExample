import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { AuthService, AuthMockService } from '../security/security.module';

import { PartyService } from './party.service';
import { Party } from './party';

import { EnvironmentService, EnvironmentMockService } from '../shared/shared.module';
 
describe('PartyService / List', () => {

    let environmentService: EnvironmentService;
    let partyService: PartyService;
    let http: HttpTestingController;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            declarations: [ ],
            imports: [HttpClientTestingModule],
            providers: [
                PartyService,
                {provide: EnvironmentService, useClass: EnvironmentMockService},
                {provide: AuthService, useClass: AuthMockService},
            ]
        });
        environmentService = TestBed.get(EnvironmentService);        
        await environmentService.initialize();           
        partyService = TestBed.get(PartyService);        
        http = TestBed.get(HttpTestingController);
    });

    it('PartyService should be created',
       () => {
           expect(partyService).toBeTruthy();
       }
      );

    using(testData, (data) => {
        it('get a PartyList',
           fakeAsync(
               () => {
                   const url = 'https://mock-invoke-url/party';

                   partyService.getPartyList().subscribe( 
                       (party) => {
                           expect(party).toEqual(data.result);
                       }
                   );
                   const request = http.expectOne({url: url});
                   expect(request.request.body).toEqual(data.apiBody);
                   request.flush(data.result);
	               tick();
               }
           )
          )
    });
});
