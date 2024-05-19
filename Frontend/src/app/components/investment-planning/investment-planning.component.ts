import { Component, OnInit } from '@angular/core';
import { InvestmentService } from '../../services/investment-planning.service';
import { Investment } from '../../models/investment-planning.model';

@Component({
  selector: 'app-investment-planning',
  templateUrl: './investment-planning.component.html',
  styleUrls: ['./investment-planning.component.css']
})
export class InvestmentPlanningComponent implements OnInit {
  investments: Investment[] = [];
  filteredInvestments: Investment[] = [];
  investment: Investment = {
    investmentId: 0,
    investmentName: '',
    initialInvestmentAmount: 0,
    investmentStartDate: new Date(),
    currentValue: 0,
    investorId: 0
  };
  selectedId: number | null = null;
  categories: string[] = [];
  selectedCategory: string = '';
  responseMessage: string = '';

  constructor(private investmentService: InvestmentService) { }

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.investmentService.getAllInvestments().subscribe(
      data => {
        this.investments = data;
        this.filteredInvestments = data;
      },
      error => {
        console.error('Error loading investments:', error);
      }
    );
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;
    this.investment = {
      ...this.investment,
      [name]: name === 'initialInvestmentAmount' || name === 'currentValue' || name === 'investorId'
        ? parseFloat(value)
        : value
    };
  }

  isCreateButtonDisabled(): boolean {
    return !this.investment.investmentName ||
      isNaN(this.investment.initialInvestmentAmount) ||
      isNaN(Date.parse(this.investment.investmentStartDate.toString())) ||
      isNaN(this.investment.currentValue) ||
      isNaN(this.investment.investorId);
  }

  handleCreateInvestment(): void {
    this.investmentService.createInvestment(this.investment).subscribe(
      response => {
        this.responseMessage = 'Investment created successfully!';
        this.loadInvestments();
        this.resetInvestmentForm();
      },
      error => {
        this.responseMessage = 'Error creating investment: ' + error.message;
      }
    );
  }

  handleUpdateInvestment(): void {
    if (this.selectedId) {
      this.investmentService.updateInvestment(this.investment).subscribe(
        response => {
          this.responseMessage = 'Investment updated successfully!';
          this.loadInvestments();
          this.resetInvestmentForm();
          this.selectedId = null;
        },
        error => {
          this.responseMessage = 'Error updating investment: ' + error.message;
        }
      );
    }
  }

  handleEditInvestment(id: number): void {
    this.investmentService.getInvestmentById(id).subscribe(data => {
      const formattedDate = new Date(data.investmentStartDate);
      this.investment = { ...data, investmentStartDate: formattedDate };
      this.selectedId = id;
    },
      error => {
        this.responseMessage = JSON.stringify(error);
      }
    );
  }

  handleDeleteInvestment(id: number): void {
    this.investmentService.deleteInvestment(id).subscribe(
      response => {
        this.responseMessage = 'Investment deleted successfully!';
        this.loadInvestments();
        this.resetInvestmentForm();
        this.selectedId = null;
      },
      error => {
        this.responseMessage = 'Error deleting investment: ' + error.message;
      }
    );
  }

  private resetInvestmentForm(): void {
    this.investment = {
      investmentId: 0,
      investmentName: '',
      initialInvestmentAmount: 0,
      investmentStartDate: new Date(),
      currentValue: 0,
      investorId: 0
    };
  }
}
