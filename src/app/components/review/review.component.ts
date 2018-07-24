import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Review } from '../../models/review';

@Component({
    selector: 'food-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
    userReview: Review;

    @Input() text: string;

    @Output() onRatingChange = new EventEmitter();

    constructor() {
        this.userReview = new Review();
    }

    onClickFood(event): void {
        this.userReview.foodRating = event.rating;
        this.emitRatingEvent();
    }

    onClickAttention(event): void {
        this.userReview.attentionRating = event.rating;
        this.emitRatingEvent();
    }

    onClickEnvironment(event): void {
        this.userReview.environmentRating = event.rating;
        this.emitRatingEvent();
    }

    changeOpinion(event): void {
        this.emitRatingEvent();
    }

    private emitRatingEvent() {
        if (
            this.userReview.foodRating &&
            this.userReview.attentionRating &&
            this.userReview.environmentRating
        )
            this.onRatingChange.emit(this.userReview);
    }
}
