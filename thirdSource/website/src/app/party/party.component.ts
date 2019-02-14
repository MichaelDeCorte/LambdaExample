import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Party } from './party';

import { PartyService }  from './party.service';

@Component({
    selector: 'app-party',
    templateUrl: './party.component.html',
    styleUrls: ['./party.component.css']
})

export class PartyComponent implements OnInit {
    @Input() party: Party;

    constructor(
        private route: ActivatedRoute,
        private partyService: PartyService,
        private location: Location
    ) {}

    ngOnInit() {
        this.getParty();
    }

    getParty(): void {
        const id = +this.route.snapshot.paramMap.get('partyID');
        this.partyService.getParty(id)
            .subscribe(
                (party) => {this.party = party}
            );
    }

    goBack(): void {
        this.location.back();
    }
}


