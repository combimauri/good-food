import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodFoodMapComponent } from './good-food-map.component';

describe('GoodFoodMapComponent', () => {
  let component: GoodFoodMapComponent;
  let fixture: ComponentFixture<GoodFoodMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodFoodMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodFoodMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
