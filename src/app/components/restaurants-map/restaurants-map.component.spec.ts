import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsMapComponent } from './restaurants-map.component';

describe('RestaurantsMapComponent', () => {
  let component: RestaurantsMapComponent;
  let fixture: ComponentFixture<RestaurantsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
