import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-bisection-method-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
  ],
  template: ` <div class="p-card">
    <h1 class="p-card-title">Bisection Method Calculator</h1>
    <div class="p-card-content">
      <div class="p-field">
        <label for="function" class="p-label">Function:</label>
        <input
          type="text"
          id="function"
          [(ngModel)]="function"
          pInputText
          placeholder="Enter the function"
        />
      </div>
      <div class="p-field">
        <label for="a" class="p-label">Lower Bound (a):</label>
        <p-inputNumber id="a" [(ngModel)]="a"></p-inputNumber>
      </div>
      <div class="p-field">
        <label for="b" class="p-label">Upper Bound (b):</label>
        <p-inputNumber id="b" [(ngModel)]="b"></p-inputNumber>
      </div>
      <div class="p-field">
        <label for="tolerance" class="p-label">Tolerance:</label>
        <p-inputNumber id="tolerance" [(ngModel)]="tolerance"></p-inputNumber>
      </div>
      <p-button label="Calculate Root" (onClick)="calculateRoot()"></p-button>
      <p *ngIf="root" class="p-mt-3">Estimated Root: {{ root }}</p>
    </div>
  </div>`,
  styles: [
    `
      .p-card {
        margin: 20px;
        padding: 20px;
      }
      .p-field {
        margin-bottom: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BisectionMethodCalculatorComponent {
  function: string = '';
  a: number = 0;
  b: number = 0;
  tolerance: number = 0.0001;
  root: number | undefined;

  calculateRoot() {
    const evalFunction = (x: number) => {
      return eval(this.function);
    };

    let fa = evalFunction(this.a);
    let fb = evalFunction(this.b);

    if (fa * fb >= 0) {
      alert(
        'Invalid interval. Function must have opposite signs at the endpoints.'
      );
      return;
    }

    let c = this.a;
    while (this.b - this.a >= this.tolerance) {
      c = (this.a + this.b) / 2;
      const fc = evalFunction(c);

      if (fc === 0) {
        break;
      }

      if (fa * fc < 0) {
        this.b = c;
        fb = fc;
      } else {
        this.a = c;
        fa = fc;
      }
    }

    this.root = c;
  }
}
