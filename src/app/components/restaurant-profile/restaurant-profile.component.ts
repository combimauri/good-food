import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';

import { Irestaurant } from '../../interfaces/irestaurant';
import { Restaurant } from '../../models/restaurant';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'food-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  restaurant: Observable<Irestaurant>;

  private restaurantDoc: AngularFirestoreDocument<Irestaurant>;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id: string = params['id'];
      this.restaurantDoc = this.afs.doc<Irestaurant>(`restaurants/${id}`);
      this.restaurant = this.restaurantDoc.valueChanges();
    });
  }

}
