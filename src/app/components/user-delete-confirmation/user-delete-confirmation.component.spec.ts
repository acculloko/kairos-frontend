import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeleteConfirmationComponent } from './user-delete-confirmation.component';

describe('UserDeleteConfirmationComponent', () => {
  let component: UserDeleteConfirmationComponent;
  let fixture: ComponentFixture<UserDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeleteConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
