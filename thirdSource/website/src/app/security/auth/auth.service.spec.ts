import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
// const testData = require(__filename.replace(/.[^.]+$/, '.json'));

import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';


import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
