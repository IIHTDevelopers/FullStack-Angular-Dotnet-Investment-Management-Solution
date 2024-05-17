import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaxManagementComponent } from './components/tax-management/tax-management.component';
import { InvestmentPlanningComponent } from './components/investment-planning/investment-planning.component';

@NgModule({
  declarations: [
    AppComponent,
    TaxManagementComponent,
    InvestmentPlanningComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
