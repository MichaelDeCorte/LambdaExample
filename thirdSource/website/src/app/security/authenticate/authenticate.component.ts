import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})

export class AuthenticateComponent implements OnInit {

    constructor(private route: Router,
                private activatedRoute: ActivatedRoute) {
        console.log('Authenticate.constructor');
    }
    
    ngOnInit() {
    }

    authenticate() {
        console.log('Authenticate()');
        let token = this.activatedRoute.snapshot.data['authorizationToken'];
        if ((token === undefined) || (token === null)) {
            this.route.navigateByUrl('/login');
        } else {
            this.route.navigateByUrl('/home');
        }
    }
}
