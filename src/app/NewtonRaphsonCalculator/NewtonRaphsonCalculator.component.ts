import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-newton-raphson-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <div>
      <h2>Newton-Raphson Root Calculator</h2>
      <span class="p-float-label">
        <input
          pInputText
          id="functionString"
          [(ngModel)]="functionString"
          name="functionString"
        />
        <label for="functionString">Function</label>
      </span>
      <span class="p-float-label" style="margin-top: 1.7rem;">
        <input
          pInputText
          id="derivativeString"
          [(ngModel)]="derivativeString"
          name="derivativeString"
        />
        <label for="derivativeString">Derivative</label>
      </span>
      <span class="p-float-label" style="margin-top: 1.7rem;">
        <input
          pInputText
          id="initialGuess"
          [(ngModel)]="initialGuess"
          name="initialGuess"
        />
        <label for="initialGuess">Initial Guess</label>
      </span>
      <span class="p-float-label" style="margin-top: 1.7rem;">
        <input
          pInputText
          id="tolerance"
          [(ngModel)]="tolerance"
          name="tolerance"
        />
        <label for="tolerance">Fault Tolerance</label>
      </span>
      <span
        class="p-float-label"
        style="margin-top: 1.7rem; margin-bottom:1.7rem"
      >
        <p-inputNumber
          [(ngModel)]="maxIterations"
          [min]="1"
          [max]="1000"
        ></p-inputNumber>
        <label>Iteration Amount</label>
      </span>
      <p-button label="Calculate Root" (onClick)="calculateRoot()"></p-button>
      <div *ngIf="result !== null">
        <p>Calculated Root: {{ result }}</p>
      </div>
      <div *ngIf="logs.length">
        <h3>Calculation Steps:</h3>
        <ul>
          <li *ngFor="let log of logs">{{ log }}</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewtonRaphsonCalculatorComponent {
  result: number | null = null;
  functionString: string = 'x^3 - x - 1'; // Example function
  derivativeString: string = '3*x^2 - 1'; // Example derivative
  initialGuess: number = 1.5; // Adjusted initial guess closer to the actual root
  tolerance: number = 0.0001;
  maxIterations: number = 1000;
  logs: string[] = []; // To store calculation steps

  constructor() {}

  calculateRoot() {
    const f = this.parseFunction(this.functionString);
    const fPrime = this.parseFunction(this.derivativeString);

    let x = this.initialGuess; // Initial guess
    this.logs = [`Starting calculation with initial guess: ${x}`];

    for (let i = 0; i < this.maxIterations; i++) {
      let fX = f(x);
      let fPrimeX = fPrime(x);

      // Check if the derivative is extremely small (close to zero)
      if (Math.abs(fPrimeX) < 1e-10) {
        this.logs.push(
          `Iteration ${
            i + 1
          }: Derivative near zero at x = ${x}, might cause numerical instability.`
        );
        break;
      }

      let nextX = x - fX / fPrimeX;
      this.logs.push(`Iteration ${i + 1}: x = ${nextX}`);

      // Check for convergence
      if (Math.abs(nextX - x) < this.tolerance) {
        this.logs.push(`Root found at ${nextX} after ${i + 1} iterations`);
        this.result = nextX;
        break;
      }

      x = nextX; // Update x for the next iteration
    }

    if (this.result === null) {
      this.logs.push(
        `No root found within the tolerance of ${this.tolerance} after ${this.maxIterations} iterations.`
      );
    }
  }

  private parseFunction(func: string): (x: number) => number {
    return (x: number) => {
      return eval(func.replace(/x/g, x.toString()));
    };
  }
}
