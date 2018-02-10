import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMyRestaurantComponent } from './register-my-restaurant.component';

describe('RegisterMyRestaurantComponent', () => {
  let component: RegisterMyRestaurantComponent;
  let fixture: ComponentFixture<RegisterMyRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMyRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMyRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
