import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { BisectionMethodCalculatorComponent } from './BisectionMethodCalculator/BisectionMethodCalculator.component';
import { FalsePositionCalculatorComponent } from './FalsePositionCalculator/FalsePositionCalculator.component';
import { NewtonRaphsonCalculatorComponent } from './NewtonRaphsonCalculator/NewtonRaphsonCalculator.component';
import { SecantMethodCalculatorComponent } from './SecantMethodCalculator/SecantMethodCalculator.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    TabViewModule,
    NewtonRaphsonCalculatorComponent,
    BisectionMethodCalculatorComponent,
    FalsePositionCalculatorComponent,
    SecantMethodCalculatorComponent,
  ],
})
export class AppComponent {
  title = 'root-estimator';
}
