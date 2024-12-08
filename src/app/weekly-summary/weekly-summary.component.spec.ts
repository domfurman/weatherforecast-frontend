import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySummaryComponent } from './weekly-summary.component';

describe('WeeklySummaryComponent', () => {
  let component: WeeklySummaryComponent;
  let fixture: ComponentFixture<WeeklySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
