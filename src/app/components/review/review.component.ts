import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'food-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
    rating: number;

    @Input() text: string;

    @Output() onRatingChange = new EventEmitter();

    constructor() {}

    onClick(event): void {
        this.rating = event.rating;
        this.onRatingChange.emit(this.rating);
    }
}
