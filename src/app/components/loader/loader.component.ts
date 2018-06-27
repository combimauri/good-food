import {
    Component,
    OnInit,
    OnChanges,
    Input,
    Output,
    SimpleChanges,
    EventEmitter
} from '@angular/core';

declare const $: any;

@Component({
    selector: 'food-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnChanges {
    @Input() percent: number;

    @Output() onLoadFinished = new EventEmitter();

    ngOnInit() {
        $('#modal-loader').modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.percent === 1) {
            $('#modal-loader').modal('show');
        }

        if (this.percent === 100) {
            $('#modal-loader').modal('hide');
            this.onLoadFinished.emit();
        }
    }
}
