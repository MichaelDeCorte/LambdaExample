import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EnvironmentService {

    config: any;

    constructor(private http: HttpClient) {
        // console.log('EnvironmentService.constructor');
    }

    ngOnDestroy() {
    }
    
    async initialize() {
        
        // console.log("EnvironmentService.initialize");

        this.config = this.updateConfig(await this.getConfigFile());

        // console.log('environment config: ' + JSON.stringify(this.config, null, 4));
        // console.log('environment angular: ' + JSON.stringify(environment, null, 4));
    }

    async getConfigFile(){
        // console.log("EnvironmentService.getConfigFile");
        return await this.http.get('/assets/environment.dev.json').toPromise();
    }

    updateConfig(c: any) {
        for (const key in c.apiEndPoints) {
            if (Object.prototype.hasOwnProperty.call(c.apiEndPoints, key)) {
                c.apiEndPoints[key].endpoint =
                    c.apiInvokeUrl +
                    c.apiEndPoints[key].endpoint;
            }
        }

        return c;
    }
   
    getConfig() {
        // console.log("EnvironmentService.getConfig");
        return this.config;
    }


}
