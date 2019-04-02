import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import { MatCardModule } from '@angular/material/card'
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppComponent } from './app.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { OverviewComponent } from './overview/overview.component';
import { ResistorCalculatorComponent } from './resistor-calculator/resistor-calculator.component';
import { ApplicationSessionService } from './application-session.service';
import { SteinhartCoefComponent } from './steinhart-coef/steinhart-coef.component';
import { UsingSteinhartComponent } from './using-steinhart/using-steinhart.component'

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
    MatGridListModule,
    NgxChartsModule,
  ],
  declarations: [AppComponent, OverviewComponent, ResistorCalculatorComponent, SteinhartCoefComponent, UsingSteinhartComponent],
  bootstrap: [AppComponent],
  providers: [ApplicationSessionService]
})
export class AppModule { }
