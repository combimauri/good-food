import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { MapStyleService } from '../../services/maps/map-style.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Icategory } from '../../interfaces/icategory';
import { IcategoryId } from '../../interfaces/icategory-id';
import { Restaurant } from '../../models/restaurant';

declare const google: any;
const cochaLat: number = -17.393695;
const cochaLng: number = -66.157126;

@Component({
  selector: 'food-restaurants-map',
  templateUrl: './restaurants-map.component.html',
  styleUrls: ['./restaurants-map.component.scss']
})
export class RestaurantsMapComponent implements OnInit {

  lat: number;

  lng: number;

  styles: Array<any>;

  isRestaurantInfoWindowOpen: boolean;

  isNewRestaurantInfoWindowOpen: boolean;

  currentRestaurant: Irestaurant;

  newRestaurant: Irestaurant;

  restaurants: Observable<IrestaurantId[]>;

  categories: Observable<IcategoryId[]>;

  private map: any;

  private restaurantsCollection: AngularFirestoreCollection<Irestaurant>;

  private categoriesCollection: AngularFirestoreCollection<Icategory>;

  @ViewChild("locationElement")
  private locationControlElement: ElementRef;

  constructor(private styleService: MapStyleService, private afs: AngularFirestore) {
    this.isRestaurantInfoWindowOpen = false;
    this.isNewRestaurantInfoWindowOpen = false;
    this.currentRestaurant = new Restaurant();
    this.newRestaurant = new Restaurant();

    this.restaurantsCollection = this.afs.collection<Irestaurant>('restaurants');
    this.restaurants = this.restaurantsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Irestaurant;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

    this.categoriesCollection = this.afs.collection<Icategory>('restaurant-categories');
    this.categories = this.categoriesCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Irestaurant;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  ngOnInit(): void {
    this.setMapStyle();
  }

  addLocationElement(event: any): void {
    this.map = event;

    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
      .push(this.locationControlElement.nativeElement);
    this.centerMapOnUserLocation();
  }

  showNewRestaurantInfoWindow(event: any): void {
    this.newRestaurant.lat = event.coords.lat;
    this.newRestaurant.lng = event.coords.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showNewRestaurantInfoWindowHere(): void {
    this.newRestaurant.lat = this.lat;
    this.newRestaurant.lng = this.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showRestaurantInfoWindow(restaurant): void {
    this.currentRestaurant = restaurant;
    this.isRestaurantInfoWindowOpen = true;
  }

  saveRestaurant(): void {
    const name: string = this.newRestaurant.name;
    const type: string = this.newRestaurant.type;
    const category: string = this.newRestaurant.category;
    const lat: number = this.newRestaurant.lat;
    const lng: number = this.newRestaurant.lng;
    const restaurant: Irestaurant = { name, type, category, lat, lng };

    this.restaurantsCollection.add(restaurant);
    this.closeNewRestaurantInfoWindow();
  }

  closeRestaurantInfoWindow(): void {
    this.isRestaurantInfoWindowOpen = false;
  }

  closeNewRestaurantInfoWindow(): void {
    this.isNewRestaurantInfoWindowOpen = false;
  }

  centerMapOnUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.map.setCenter({ lat: this.lat, lng: this.lng });
        },
        () => {
          this.handleLocationError(true);
        });
    } else {
      this.handleLocationError(false);
    }
  }

  private setMapStyle(): void {
    this.styleService.getStyles().subscribe(
      response => {
        this.styles = response;
      },
      error => {
        this.styles = [
          {
            featureType: "poi",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];
      }
    );
  }

  private handleLocationError(browserHasGeolocation): void {
    this.lat = cochaLat;
    this.lng = cochaLng;
    let errorMessage = browserHasGeolocation ?
      'Error: El servicio de Geolocalización falló.' :
      'Error: Tu navegador no soporta Geolocalización.';

    this.map.setCenter({ lat: this.lat, lng: this.lng });
    console.error(errorMessage);
  }

}
