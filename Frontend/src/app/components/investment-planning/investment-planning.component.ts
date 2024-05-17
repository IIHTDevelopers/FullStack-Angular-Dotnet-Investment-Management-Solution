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
  investment: Investment = { id: 0, name: '', amount: 0, date: new Date(), category: '' };
  selectedId: number | null = null;
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(private investmentService: InvestmentService) { }

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.investmentService.getAllInvestments().subscribe(
      data => {
        this.investments = data;
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        this.categories = uniqueCategories;
      },
      error => {
        console.error('Error loading investments:', error);
      }
    );
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;
    this.investment = { ...this.investment, [name]: value };
  }

  isCreateButtonDisabled(): boolean {
    return !this.investment.name || isNaN(Number(this.investment.amount)) || isNaN(Date.parse(this.investment.date.toString())) || !this.investment.category;
  }

  handleCreateInvestment(): void {
    this.investmentService.createInvestment(this.investment).subscribe(() => {
      this.loadInvestments();
      this.investment = { id: 0, name: '', amount: 0, date: new Date(), category: '' };
    });
  }

  handleUpdateInvestment(): void {
    if (this.selectedId) {
      this.investmentService.updateInvestment(this.selectedId, this.investment).subscribe(() => {
        this.loadInvestments();
        this.investment = { id: 0, name: '', amount: 0, date: new Date(), category: '' };
        this.selectedId = null;
      });
    }
  }

  handleEditInvestment(id: number): void {
    this.investmentService.getInvestmentById(id).subscribe(data => {
      const formattedDate = new Date(data.date).toISOString().split('T')[0];
      this.investment = { ...data, date: formattedDate };
      this.selectedId = id;
    });
  }

  handleDeleteInvestment(id: number): void {
    this.investmentService.deleteInvestment(id).subscribe(() => {
      this.loadInvestments();
      this.investment = { id: 0, name: '', amount: 0, date: new Date(), category: '' };
      this.selectedId = null;
    });
  }

  handleFilterByCategory(): void {
    if (this.selectedCategory) {
      this.investmentService.fetchByCategories(this.selectedCategory).subscribe(data => this.investments = data);
    } else {
      this.loadInvestments();
    }
  }
}
