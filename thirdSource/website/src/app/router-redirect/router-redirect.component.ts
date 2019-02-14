// $ROOT/app.module.ts
//    declarations: [
//        RouterRedirectComponent
//    ],
//
// app-router.module.ts
// import { RouterRedirectComponent } from '../router-redirect/router-redirect.component';
// routes: Routes = [
// { path: 'a path',
//   component: RouterRedirectComponent,
//   data: {
//       url: 'a url'
//   }
// },
// ]


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-router-redirect',
    templateUrl: './router-redirect.component.html',
    styleUrls: ['./router-redirect.component.css']
})

export class RouterRedirectComponent {

    constructor(
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        window.location.href = this.activatedRoute.snapshot.data.url;
    }
}
