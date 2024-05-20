import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvestmentService } from './investment-planning.service';
import { Investment } from '../models/investment-planning.model';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvestmentService]
    });
    service = TestBed.inject(InvestmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('business', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should fetch all investments', () => {
      const expectedInvestments: Investment[] = [
        {
          investmentId: 1,
          investmentName: 'Investment 1',
          initialInvestmentAmount: 1000,
          investmentStartDate: new Date('2023-01-01'),
          currentValue: 1500,
          investorId: 1
        }
      ];

      service.getAllInvestments().subscribe((investments: any) => {
        expect(investments).toEqual(expectedInvestments);
      });

      const req = httpTestingController.expectOne('http://localhost:5000/get-all-investments');
      expect(req.request.method).toEqual('GET');
      req.flush(expectedInvestments);
    });

    it('should get investment by ID', () => {
      const testInvestment: Investment = {
        investmentId: 1,
        investmentName: 'Investment 1',
        initialInvestmentAmount: 1000,
        investmentStartDate: new Date('2023-01-01'),
        currentValue: 1500,
        investorId: 1
      };

      service.getInvestmentById(1).subscribe((investment: any) => {
        expect(investment).toEqual(testInvestment);
      });

      const req = httpTestingController.expectOne('http://localhost:5000/get-Investment-by-id?id=1');
      expect(req.request.method).toEqual('GET');
      req.flush(testInvestment);
    });

    it('should create a new investment', () => {
      const newInvestment: Investment = {
        investmentId: 1,
        investmentName: 'New Investment',
        initialInvestmentAmount: 1000,
        investmentStartDate: new Date('2023-01-01'),
        currentValue: 1500,
        investorId: 1
      };

      service.createInvestment(newInvestment).subscribe((response: any) => {
        expect(response).toEqual(newInvestment);
      });

      const req = httpTestingController.expectOne('http://localhost:5000/create-investment');
      expect(req.request.method).toEqual('POST');
      req.flush(newInvestment);
    });

    it('should update an existing investment', () => {
      const updatedInvestment: Investment = {
        investmentId: 1,
        investmentName: 'Updated Investment',
        initialInvestmentAmount: 1500,
        investmentStartDate: new Date('2023-01-01'),
        currentValue: 2000,
        investorId: 1
      };

      service.updateInvestment(updatedInvestment).subscribe((response: any) => {
        expect(response).toEqual(updatedInvestment);
      });

      const req = httpTestingController.expectOne('http://localhost:5000/update-investment');
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedInvestment);
    });

    it('should delete an investment', () => {
      const investmentId = 1;

      service.deleteInvestment(investmentId).subscribe((response: any) => {
        expect(response).toBeUndefined();
      });

      const req = httpTestingController.expectOne(`http://localhost:5000/delete-Investment?id=${investmentId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });
});
