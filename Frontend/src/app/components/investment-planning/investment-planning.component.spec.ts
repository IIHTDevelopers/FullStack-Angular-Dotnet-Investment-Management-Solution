import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../services/investment-planning.service';
import { InvestmentPlanningComponent } from './investment-planning.component';
import { Investment } from '../../models/investment-planning.model';

describe('InvestmentPlanningComponent', () => {
  let component: InvestmentPlanningComponent;
  let service: InvestmentService;
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<InvestmentPlanningComponent>;

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
        id: 1,
        name: 'Investment 1',
        amount: 1000,
        date: new Date('2023-01-01'),
        category: 'Category 1'
      }
    ];

    component.ngOnInit();

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);

    expect(component.investments).toEqual(expectedInvestments);
    expect(component.categories).toEqual(['Category 1']);
  });

  it('should create a new investment', () => {
    const newInvestment: Investment = {
      id: 1,
      name: 'New Investment',
      amount: 1000,
      date: new Date('2023-01-01'),
      category: 'Category 1'
    };

    component.investment = newInvestment;

    component.handleCreateInvestment();

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    expect(req.request.method).toEqual('POST');
    req.flush(newInvestment);

    const reqGet = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    reqGet.flush([newInvestment]);

    expect(component.investment).toEqual({ id: 0, name: '', amount: 0, date: new Date(), category: '' });
  });

  it('should update an existing investment', () => {
    const updatedInvestment: Investment = {
      id: 1,
      name: 'Updated Investment',
      amount: 1500,
      date: new Date('2023-01-01'),
      category: 'Category 1'
    };

    component.investment = updatedInvestment;
    component.selectedId = 1;

    component.handleUpdateInvestment();

    const req = httpTestingController.expectOne(`http://localhost:8081/investment/api/investments/1`);
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedInvestment);

    const reqGet = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    reqGet.flush([updatedInvestment]);

    expect(component.investment).toEqual({ id: 0, name: '', amount: 0, date: new Date(), category: '' });
    expect(component.selectedId).toBeNull();
  });

  it('should delete an investment', () => {
    component.handleDeleteInvestment(1);

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});

    const reqGet = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    reqGet.flush([]);

    expect(component.investment).toEqual({ id: 0, name: '', amount: 0, date: new Date(), category: '' });
    expect(component.selectedId).toBeNull();
  });

  it('should filter investments by category', () => {
    const expectedInvestments: Investment[] = [
      {
        id: 1,
        name: 'Investment 1',
        amount: 1000,
        date: new Date('2023-01-01'),
        category: 'Category 1'
      }
    ];

    component.selectedCategory = 'Category 1';
    component.handleFilterByCategory();

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments/category/Category 1');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);

    expect(component.investments).toEqual(expectedInvestments);
  });

  it('should reset investments when no category is selected', () => {
    const expectedInvestments: Investment[] = [
      {
        id: 1,
        name: 'Investment 1',
        amount: 1000,
        date: new Date('2023-01-01'),
        category: 'Category 1'
      }
    ];

    component.selectedCategory = '';
    component.handleFilterByCategory();

    const req = httpTestingController.expectOne('http://localhost:8081/investment/api/investments');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedInvestments);

    expect(component.investments).toEqual(expectedInvestments);
  });
});
