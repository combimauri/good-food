import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWallComponent } from './user-wall.component';

describe('UserWallComponent', () => {
  let component: UserWallComponent;
  let fixture: ComponentFixture<UserWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
