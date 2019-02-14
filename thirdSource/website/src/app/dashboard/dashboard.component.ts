
import { Component, OnInit } from '@angular/core';
import { Party } from '../party/party';
import { PartyService } from '../party/party.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
    partyList: Party[] = [];

    constructor(private partyService: PartyService) {
        console.log('Dashboard.constructor');
    }

    ngOnInit() {
        this.getPartyList(); 
    }

    getPartyList(): void {
        console.log('dashboard.ngoninit: ' + this.partyService);
        this.partyService.getPartyList()
            .subscribe(partyList => this.partyList = partyList.slice(1, 5));
    }
}

