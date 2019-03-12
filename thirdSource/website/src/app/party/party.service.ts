import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY, of } from 'rxjs';

// import { uri } from '../../../../party/test/party.dev.uri.js'; // mrd

import { EnvironmentService } from '../shared/shared.module';

import { Party } from './party';

import { AuthService } from '../security/security.module';

@Injectable({
    providedIn: 'root'
})

export class PartyService {

    private config;

    constructor(private http: HttpClient,
                private authService: AuthService,
                private environmentService: EnvironmentService
               ) {

        this.config  = this.environmentService.getConfig();
        console.log('PartyService.constructor');
    }


    getPartyList(): Observable<Party[]> {

        let body = {
            command: "scanParty",
            FilterExpression: "lastName = :lastName",
            ExpressionAttributeValues: {
                ":lastName": "Washington"
            }
        };

        let httpOptions = {
            headers: this.authService.getAuthorizationHeaders()
        };

        if ((httpOptions.headers === null) || (httpOptions.headers === undefined)) {
            console.log('not authenticated');
            return EMPTY;
        }
        else {
             return this.http.post<Party[]>(this.config.partyUri, body, httpOptions);
        }
    }

    getParty(partyID: number): Observable<Party> {

        let body = {
            command: "getParty",
            partyID: partyID
        };

        let httpOptions = {
            headers: this.authService.getAuthorizationHeaders()
        };

        if ((httpOptions.headers === null) || (httpOptions.headers === undefined)) {
            console.log('not authenticated');
            return EMPTY;
        } else {
            return this.http.post<Party>(this.config.partyUri, body, httpOptions);
       }
    }
}
