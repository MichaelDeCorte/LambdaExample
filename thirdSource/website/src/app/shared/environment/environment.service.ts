import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EnvironmentService {

    private config;

    constructor(private http: HttpClient) {
        console.log('EnvironmentService.constructor');
    }

    ngOnDestroy() {
    }
    
    async initialize() {
        
        this.config = await this.http.get('/assets/environment.dev.json').toPromise();

        for (const key in this.config.apiEndPoints) {
            if (Object.prototype.hasOwnProperty.call(this.config.apiEndPoints, key)) {
                this.config.apiEndPoints[key].endpoint =
                    this.config.apiInvokeUrl +
                    this.config.apiEndPoints[key].endpoint;
            }
        }

        console.log('environment config: ' + JSON.stringify(this.config, null, 4));
        console.log('environment angular: ' + JSON.stringify(environment, null, 4));
    }

    getConfig() {
        return this.config;
    }


}
