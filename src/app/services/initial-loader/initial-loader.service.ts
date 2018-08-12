import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class InitialLoaderService {
    constructor() {}

    hideInitialLoader(): void {
        $('#initial-loader').hide();
    }
}
