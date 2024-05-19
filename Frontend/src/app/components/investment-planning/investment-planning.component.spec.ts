import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../services/investment-planning.service';
import { InvestmentPlanningComponent } from './investment-planning.component';
import { Investment } from '../../models/investment-planning.model';

describe('InvestmentPlanningComponent', () => {
  let component: InvestmentPlanningComponent;
  let fixture: ComponentFixture<InvestmentPlanningComponent>;
  let service: InvestmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentPlanningComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [InvestmentService]
    });

    fixture = TestBed.createComponent(InvestmentPlanningComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(InvestmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all investments on init', () => {
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

    component.ngOnInit();

    const req = httpTestingController.expectOne('http://localhost:5000/get-all-investments');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);

    expect(component.investments).toEqual(expectedInvestments);
    expect(component.filteredInvestments).toEqual(expectedInvestments);
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

    component.investment = newInvestment;
    component.handleCreateInvestment();

    const req = httpTestingController.expectOne('http://localhost:5000/create-investment');
    expect(req.request.method).toEqual('POST');
    req.flush(newInvestment);

    const reqGet = httpTestingController.expectOne('http://localhost:5000/get-all-investments');
    reqGet.flush([newInvestment]);

    expect(component.investment).toEqual({
      investmentId: 0,
      investmentName: '',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    });
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

    component.investment = updatedInvestment;
    component.selectedId = 1;
    component.handleUpdateInvestment();

    const req = httpTestingController.expectOne('http://localhost:5000/update-investment');
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedInvestment);

    const reqGet = httpTestingController.expectOne('http://localhost:5000/get-all-investments');
    reqGet.flush([updatedInvestment]);

    expect(component.investment).toEqual({
      investmentId: 0,
      investmentName: '',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    });
    expect(component.selectedId).toBeNull();
  });

  it('should delete an investment', () => {
    component.handleDeleteInvestment(1);

    const req = httpTestingController.expectOne('http://localhost:5000/delete-Investment?id=1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});

    const reqGet = httpTestingController.expectOne('http://localhost:5000/get-all-investments');
    reqGet.flush([]);

    expect(component.investment).toEqual({
      investmentId: 0,
      investmentName: '',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    });
    expect(component.selectedId).toBeNull();
  });

  it('should handle error when creating investment', () => {
    component.investment = {
      investmentId: 0,
      investmentName: 'Investment Error',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    };
    component.handleCreateInvestment();

    const req = httpTestingController.expectOne('http://localhost:5000/create-investment');
    req.flush('Error creating investment', { status: 500, statusText: 'Server Error' });

    expect(component.responseMessage).toContain('Error creating investment');
  });

  it('should handle error when updating investment', () => {
    component.investment = {
      investmentId: 1,
      investmentName: 'Investment Error',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    };
    component.selectedId = 1;
    component.handleUpdateInvestment();

    const req = httpTestingController.expectOne('http://localhost:5000/update-investment');
    req.flush('Error updating investment', { status: 500, statusText: 'Server Error' });

    expect(component.responseMessage).toContain('Error updating investment');
  });

  it('should handle error when deleting investment', () => {
    component.handleDeleteInvestment(1);

    const req = httpTestingController.expectOne('http://localhost:5000/delete-Investment?id=1');
    req.flush('Error deleting investment', { status: 500, statusText: 'Server Error' });

    expect(component.responseMessage).toContain('Error deleting investment');
  });

  it('should handle edit investment', () => {
    const testInvestment: Investment = {
      investmentId: 1,
      investmentName: 'Test Investment',
      initialInvestmentAmount: 1000,
      investmentStartDate: new Date('2023-01-01'),
      currentValue: 1500,
      investorId: 1
    };

    component.handleEditInvestment(1);

    const req = httpTestingController.expectOne('http://localhost:5000/get-Investment-by-id?id=1');
    expect(req.request.method).toEqual('GET');
    req.flush(testInvestment);

    expect(component.investment).toEqual({
      ...testInvestment,
      investmentStartDate: new Date('2023-01-01')
    });
    expect(component.selectedId).toEqual(1);
  });
});
