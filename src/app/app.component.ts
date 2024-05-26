import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { BisectionMethodCalculatorComponent } from './BisectionMethodCalculator/BisectionMethodCalculator.component';
import { FalsePositionCalculatorComponent } from './FalsePositionCalculator/FalsePositionCalculator.component';
import { NewtonRaphsonCalculatorComponent } from './NewtonRaphsonCalculator/NewtonRaphsonCalculator.component';
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
  ],
})
export class AppComponent {
  title = 'root-estimator';
}
