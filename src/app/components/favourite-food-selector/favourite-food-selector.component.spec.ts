import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteFoodSelectorComponent } from './favourite-food-selector.component';

describe('FavouriteFoodSelectorComponent', () => {
  let component: FavouriteFoodSelectorComponent;
  let fixture: ComponentFixture<FavouriteFoodSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteFoodSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteFoodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
