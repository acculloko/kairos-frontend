import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHoursComponent } from './user-hours.component';

describe('UserHoursComponent', () => {
  let component: UserHoursComponent;
  let fixture: ComponentFixture<UserHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
