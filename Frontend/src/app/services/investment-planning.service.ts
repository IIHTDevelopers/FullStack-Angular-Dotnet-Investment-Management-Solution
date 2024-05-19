import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Investment } from '../models/investment-planning.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getAllInvestments(): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}/get-all-investments`);
  }

  getInvestmentById(id: number): Observable<Investment> {
    return this.http.get<Investment>(`${this.apiUrl}/get-Investment-by-id?id=${id}`);
  }

  createInvestment(investment: Investment): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-investment`, investment, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateInvestment(investment: Investment): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-investment`, investment, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteInvestment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-Investment?id=${id}`);
  }
}
