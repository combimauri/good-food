import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { MapStyleService } from '../../services/maps/map-style.service';
import { Restaurant } from '../../models/restaurant';

declare const google: any;
const cochaLat: number = -17.393695;
const cochaLng: number = -66.157126;

@Component({
  selector: 'food-good-food-map',
  templateUrl: './good-food-map.component.html',
  styleUrls: ['./good-food-map.component.scss']
})
export class GoodFoodMapComponent implements OnInit {

  map: any;
  lat: number;
  lng: number;
  styles: any;
  markers: any;
  isRestaurantInfoWindowOpen: boolean;
  isNewRestaurantInfoWindowOpen: boolean;
  currentRestaurant: Restaurant;
  newRestaurant: Restaurant;
  restaurants: Observable<Restaurant[]>;
  private restaurantsRef: AngularFireList<Restaurant>;
  @ViewChild("locationElement") locationControlElement: ElementRef;

  constructor(private styleService: MapStyleService, private db: AngularFireDatabase) {
    this.isRestaurantInfoWindowOpen = false;
    this.isNewRestaurantInfoWindowOpen = false;
    this.currentRestaurant = new Restaurant();
    this.newRestaurant = new Restaurant();
    this.restaurantsRef = db.list<Restaurant>('restaurants');
    this.restaurants = this.restaurantsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  ngOnInit() {
    this.setMapStyle();
    this.getUserLocation();
  }

  addLocationElement(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
      .push(this.locationControlElement.nativeElement);
  }

  showNewRestaurantInfoWindow(event: any) {
    this.newRestaurant.lat = event.coords.lat;
    this.newRestaurant.lng = event.coords.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showNewRestaurantInfoWindowHere() {
    this.newRestaurant.lat = this.lat;
    this.newRestaurant.lng = this.lng;
    this.isNewRestaurantInfoWindowOpen = true;
  }

  showRestaurantInfoWindow(restaurant) {
    this.currentRestaurant = restaurant;
    this.isRestaurantInfoWindowOpen = true;
  }

  saveRestaurant(): void {
    this.restaurantsRef.push(this.newRestaurant);
    this.closeNewRestaurantInfoWindow();
  }

  closeRestaurantInfoWindow(): void {
    this.isRestaurantInfoWindowOpen = false;
  }

  closeNewRestaurantInfoWindow(): void {
    this.isNewRestaurantInfoWindowOpen = false;
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        () => {
          this.handleLocationError(true);
        });
    } else {
      this.handleLocationError(false);
    }
  }

  private setMapStyle() {
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
      'Error: Tu navegador no soporta Geolocalización.'
    console.error(errorMessage);
  }

}
