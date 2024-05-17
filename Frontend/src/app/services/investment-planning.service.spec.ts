import { TestBed } from '@angular/core/testing';

import { InvestmentPlanningService } from './investment-planning.service';

describe('InvestmentPlanningService', () => {
  let service: InvestmentPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
