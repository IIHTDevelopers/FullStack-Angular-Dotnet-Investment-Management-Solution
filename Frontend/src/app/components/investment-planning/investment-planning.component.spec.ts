import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPlanningComponent } from './investment-planning.component';

describe('InvestmentPlanningComponent', () => {
  let component: InvestmentPlanningComponent;
  let fixture: ComponentFixture<InvestmentPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
