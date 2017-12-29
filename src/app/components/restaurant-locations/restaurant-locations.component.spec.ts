import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantLocationsComponent } from './restaurant-locations.component';

describe('RestaurantLocationsComponent', () => {
  let component: RestaurantLocationsComponent;
  let fixture: ComponentFixture<RestaurantLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
