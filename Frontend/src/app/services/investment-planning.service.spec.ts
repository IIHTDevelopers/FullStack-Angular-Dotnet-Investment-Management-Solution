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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all investments', () => {
    const expectedInvestments: Investment[] = [
      {
        id: 1,
        name: 'Investment 1',
        amount: 1000,
        date: new Date('2023-01-01'),
        category: 'Category 1'
      }
    ];

    service.getAllInvestments().subscribe((investments: any) => {
      expect(investments).toEqual(expectedInvestments);
    });

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);
  });

  it('should get investment by ID', () => {
    const testInvestment: Investment = {
      id: 1,
      name: 'Investment 1',
      amount: 1000,
      date: new Date('2023-01-01'),
      category: 'Category 1'
    };

    service.getInvestmentById(1).subscribe((investment: any) => {
      expect(investment).toEqual(testInvestment);
    });

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testInvestment);
  });

  it('should create a new investment', () => {
    const newInvestment: Investment = {
      id: 1,
      name: 'New Investment',
      amount: 1000,
      date: new Date('2023-01-01'),
      category: 'Category 1'
    };

    service.createInvestment(newInvestment).subscribe((investment: any) => {
      expect(investment).toEqual(newInvestment);
    });

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    expect(req.request.method).toEqual('POST');
    req.flush(newInvestment);
  });

  it('should update an existing investment', () => {
    const updatedInvestment: Investment = {
      id: 1,
      name: 'Updated Investment',
      amount: 1500,
      date: new Date('2023-01-01'),
      category: 'Category 1'
    };

    service.updateInvestment(updatedInvestment.id, updatedInvestment).subscribe((investment: any) => {
      expect(investment).toEqual(updatedInvestment);
    });

    const req = httpTestingController.expectOne(`http://localhost:8081/investment/api/investments/${updatedInvestment.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedInvestment);
  });

  it('should delete an investment', () => {
    const investmentId = 1;

    service.deleteInvestment(investmentId).subscribe((response: any) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`http://localhost:8081/investment/api/investments/${investmentId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should fetch investments by category', () => {
    const expectedInvestments: Investment[] = [
      {
        id: 1,
        name: 'Investment 1',
        amount: 1000,
        date: new Date('2023-01-01'),
        category: 'Category 1'
      }
    ];

    service.fetchByCategories('Category 1').subscribe((investments: any) => {
      expect(investments).toEqual(expectedInvestments);
    });

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments/category/Category 1');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);
  });
});
