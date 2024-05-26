import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { derivative, evaluate } from 'mathjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
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
    TableModule,
  ],
  template: `
    <div [formGroup]="form" class="flex flex-column">
      <h2>Newton-Raphson Root Calculator</h2>
      <span class="flex flex-column">
        <label for="functionString">Function</label>
        <input
          pInputText
          id="functionString"
          formControlName="functionString"
          name="functionString"
        />
      </span>
      <span class="flex flex-column" style="margin-top: 1.7rem;">
        <label for="derivativeString">Derivative</label>
        <input
          pInputText
          id="derivativeString"
          formControlName="derivativeString"
          name="derivativeString"
        />
      </span>
      <span class="flex flex-column" style="margin-top: 1.7rem;">
        <label for="initialGuess">Initial Guess</label>
        <input
          pInputText
          id="initialGuess"
          formControlName="initialGuess"
          name="initialGuess"
        />
      </span>
      <span
        class="flex flex-column"
        style="margin-top: 1.7rem; margin-bottom:1.7rem"
      >
        <label>Iteration Amount</label>
        <p-inputNumber
          formControlName="numberOfIterations"
          [min]="1"
          [max]="1000"
        ></p-inputNumber>
      </span>
      <p-button label="Calculate Root" (onClick)="calculateRoot()"></p-button>
      @if (result !== null){
      <p>Calculated Root: {{ result }}</p>
      } @if (iterationData.length){
      <p-table [value]="iterationData">
        <ng-template pTemplate="header">
          <tr>
            <th>Iteration</th>
            <th>xi</th>
            <th>f(xi)</th>
            <th>f'(xi)</th>
            <th>xi + 1</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-data>
          <tr>
            <td>{{ data.iteration }}</td>
            <td>{{ data.xi }}</td>
            <td>{{ data.fxi }}</td>
            <td>{{ data.fpxi }}</td>
            <td>{{ data.xiPlus1 }}</td>
          </tr>
        </ng-template>
      </p-table>
      }
      <!-- @if (logs.length){
      <h3>Calculation Steps:</h3>
      <ul>
        <li *ngFor="let log of logs">{{ log }}</li>
      </ul>
      } -->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewtonRaphsonCalculatorComponent implements OnInit {
  result: number | null = null;
  // logs: string[] = [];
  iterationData: any[] = [];
  form!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      functionString: 'x^3 - x - 1',
      derivativeString: '3*x^2 - 1',
      initialGuess: 1.5,
      numberOfIterations: 1000,
    });

    this.form.get('functionString')?.valueChanges.subscribe((value) => {
      this.getDerivative(value);
    });
  }

  getDerivative(value: string) {
    try {
      const derivativeFunction = derivative(value, 'x');
      this.form
        .get('derivativeString')
        ?.setValue(derivativeFunction.toString());
    } catch (error) {
      console.error('Error calculating derivative:', error);
    }
  }

  calculateRoot() {
    const functionString = this.form.get('functionString')?.value;
    const derivativeString = this.form.get('derivativeString')?.value;
    const initialGuess = this.form.get('initialGuess')?.value;
    const maxIterations = this.form.get('numberOfIterations')?.value;

    const f = (x: number) => evaluate(functionString, { x });
    const fPrime = (x: number) => evaluate(derivativeString, { x });

    let x = initialGuess;
    // this.logs = [`Starting calculation with initial guess: ${x}`];
    this.iterationData = [];

    for (let i = 0; i < maxIterations; i++) {
      const fX = f(x);
      const fPrimeX = fPrime(x);

      // if (Math.abs(fPrimeX) < 1e-10) {
      //   this.logs.push(
      //     `Iteration ${
      //       i + 1
      //     }: Derivative near zero at x = ${x}, might cause numerical instability.`
      //   );
      //   break;
      // }

      const nextX = x - fX / fPrimeX;
      this.iterationData.push({
        iteration: i + 1,
        xi: x,
        fxi: fX,
        fpxi: fPrimeX,
        xiPlus1: nextX,
      });

      // this.logs.push(`Iteration ${i + 1}: x = ${nextX}`);

      if (Math.abs(nextX - x) < 1e-10) {
        // this.logs.push(`Root found at ${nextX} after ${i + 1} iterations`);
        this.result = nextX;
        break;
      }

      x = nextX;
    }

    // if (this.result === null) {
    //   this.logs.push(
    //     `No root found within the tolerance after ${maxIterations} iterations.`
    //   );
    // }
  }
}
