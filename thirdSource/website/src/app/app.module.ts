import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SecurityModule } from './security/security.module';
import { UiModule as SecurityUiModule} from './security/ui.module';

import { AppComponent } from './app.component';
import { PartyComponent } from './party/party.component';
import { PartyListComponent } from './party-list/party-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterRedirectComponent } from './router-redirect/router-redirect.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,

        AppRoutingModule,
        SecurityUiModule,
    ],
    declarations: [
        AppComponent,
        PartyComponent,
        PartyListComponent,
        DashboardComponent,
        RouterRedirectComponent,
        HomeComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
