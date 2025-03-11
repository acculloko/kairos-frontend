import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelogDeleteConfirmationComponent } from './timelog-delete-confirmation.component';

describe('TimelogDeleteConfirmationComponent', () => {
  let component: TimelogDeleteConfirmationComponent;
  let fixture: ComponentFixture<TimelogDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelogDeleteConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelogDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
