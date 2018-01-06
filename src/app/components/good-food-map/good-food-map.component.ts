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

  lat: number;

  lng: number;

  styles: Array<any>;

  isRestaurantInfoWindowOpen: boolean;

  isNewRestaurantInfoWindowOpen: boolean;

  currentRestaurant: Restaurant;

  newRestaurant: Restaurant;

  restaurants: Observable<Restaurant[]>;

  private map: any;

  private restaurantsRef: AngularFireList<Restaurant>;

  @ViewChild("locationElement")
  private locationControlElement: ElementRef;

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
    this.restaurantsRef.push(this.newRestaurant);
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
    this.map.setCenter({ lat: this.lat, lng: this.lng });

    let errorMessage = browserHasGeolocation ?
      'Error: El servicio de Geolocalización falló.' :
      'Error: Tu navegador no soporta Geolocalización.'
    console.error(errorMessage);
  }

}
