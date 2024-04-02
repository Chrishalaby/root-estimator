import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-newton-raphson-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
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
          type="number"
        />
        <label for="initialGuess">Initial Guess</label>
      </span>

      <p-button label="Calculate Root" (onClick)="calculateRoot()"></p-button>
      <div *ngIf="result !== null">
        <p>Calculated Root: {{ result }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewtonRaphsonCalculatorComponent {
  result: number | null = null;
  functionString: string = 'x^2 - 4'; // Example function
  derivativeString: string = '2*x'; // Example derivative
  initialGuess: number = 1;
  tolerance: number = 0.0001;
  maxIterations: number = 1000;

  constructor() {}

  calculateRoot() {
    const f = this.parseFunction(this.functionString);
    const fPrime = this.parseFunction(this.derivativeString);
    let x = this.initialGuess;
    for (let i = 0; i < this.maxIterations; i++) {
      let nextX = x - f(x) / fPrime(x);
      if (Math.abs(nextX - x) < this.tolerance) {
        this.result = nextX;
        break;
      }
      x = nextX;
    }
  }

  private parseFunction(func: string): (x: number) => number {
    return new Function('x', `return ${func};`) as (x: number) => number;
  }
}
