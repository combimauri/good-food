import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
        CommonModule
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googlemaps
        // })
    ],
    exports: [AgmCoreModule],
    declarations: []
})
export class AgmCustomModule {
    static agmModule: ModuleWithProviders = AgmCoreModule.forRoot({
        apiKey: environment.googlemaps
    });

    static forRoot(): ModuleWithProviders {
        return this.agmModule;
    }
}
