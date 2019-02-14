import { Component, OnInit } from '@angular/core';

import { Party } from '../party/party';
import { PartyService } from '../party/party.service';

@Component({
    selector: 'app-party-list',
    templateUrl: './party-list.component.html',
    styleUrls: ['./party-list.component.css']
})

export class PartyListComponent implements OnInit {

//    selectedParty: Party;


    partyList: Party[];

    constructor(private partyService: PartyService) {
        console.log('PartyList.constructor');
    }

    ngOnInit() {
    console.log('Partylistcomponent');
        this.getPartyList();
    }

    getPartyList(): void {
        this.partyService.getPartyList()
            .subscribe(partyList => this.partyList = partyList);
    }

//    onSelect(party: Party): void {
//        this.selectedParty = party;
//    }
}
