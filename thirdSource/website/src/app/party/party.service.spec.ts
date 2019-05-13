import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { AuthService } from '../security/security.module';

import { PartyService } from './party.service';

import { EnvironmentService, EnvironmentMockService } from '../shared/shared.module';
 
describe('PartyService', () => {

    let environmentService: EnvironmentService;
    let partyService: PartyService;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            declarations: [ ],
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                PartyService,
                {provide: EnvironmentService, useClass: EnvironmentMockService}
            ]
        });
        environmentService = TestBed.get(EnvironmentService);        
        await environmentService.initialize();           
        partyService = TestBed.get(PartyService);        
    });

    it('should be created',
       () => {
           expect(partyService).toBeTruthy();
       }
      );
});
