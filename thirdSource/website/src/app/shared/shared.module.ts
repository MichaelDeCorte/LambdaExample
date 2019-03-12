import { NgModule, ModuleWithProviders, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentService } from './environment/environment.service';

function initEnvironment(environmentService: EnvironmentService) {
    return () => environmentService.initialize();
}

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
    ],
    providers: [
        EnvironmentService,
        {
            provide: APP_INITIALIZER,
            useFactory: initEnvironment,
            deps: [EnvironmentService],
            multi: true
        }
    ],
    declarations: [
    ]
})

export class SharedModule {
    constructor (@Optional() @SkipSelf() parentModule: SharedModule) {
        if (parentModule) {
            throw new Error(
                'SharedModule is already loaded. Import it in the AppModule only');
        }
    }

    ngOnDestroy() {
        console.log('SharedModule.ngOnDestroy');
    }
}

export { EnvironmentService } from './environment/environment.service';
