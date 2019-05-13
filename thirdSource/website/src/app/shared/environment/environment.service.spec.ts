import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
const testData = require(__filename.replace(/.[^.]+$/, '.json'));

import { HttpClient } from '@angular/common/http';

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {

    let environmentService: EnvironmentService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EnvironmentService],
        });
        environmentService = TestBed.get(EnvironmentService);
        http = TestBed.get(HttpTestingController);
    });

    using(testData, (data) => {
            it('should get environment',
               fakeAsync(
                   () => {
                       const url = '/assets/environment.dev.json';
                       
                       environmentService.initialize();
                       const requestWrapper = http.expectOne({url: url});
                       requestWrapper.flush(data.input);
	                   tick();
                       let config = environmentService.getConfig();

                       expect(config).toBeTruthy();
                       expect(config.apiInvokeUrl).toEqual(data.result.apiInvokeUrl);
                   }
               )
              )
    });
});
