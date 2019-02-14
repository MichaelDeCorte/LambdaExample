import { uri } from '../../../../party/test/party.uat.uri.js';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY, of } from 'rxjs';

import { Party } from './party';

import { AuthService } from '../security/security.module';

@Injectable({
    providedIn: 'root'
})

export class PartyService {

    private partyUrl = uri;  // URL to web api

    constructor(private http: HttpClient,
                private authService: AuthService) {
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

        console.log('httpOptions.headers: ' + httpOptions.headers);
        if ((httpOptions.headers === null) || (httpOptions.headers === undefined)) {
            console.log('not authenticated');
            return EMPTY;
        }
        else {
             return this.http.post<Party[]>(this.partyUrl, body, httpOptions);
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
            return this.http.post<Party>(this.partyUrl, body, httpOptions);
       }
    }
}
