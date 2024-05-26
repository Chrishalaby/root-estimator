import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { evaluate } from 'mathjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-secant-method-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ReactiveFormsModule,
    TableModule,
  ],
  template: `<div class="p-card" [formGroup]="form">
    <h1 class="p-card-title">Secant Method Calculator</h1>
    <div class="p-card-content">
      <div class="flex flex-column mt-2">
        <label for="function" class="p-label">Function:</label>
        <input
          type="text"
          id="function"
          formControlName="function"
          pInputText
          placeholder="Enter the function"
        />
      </div>
      <div class="flex flex-column mt-2">
        <label for="x0" class="p-label">Initial Guess x0:</label>
        <p-inputNumber id="x0" formControlName="x0"></p-inputNumber>
      </div>
      <div class="flex flex-column mt-2">
        <label for="x1" class="p-label">Initial Guess x1:</label>
        <p-inputNumber id="x1" formControlName="x1"></p-inputNumber>
      </div>
      <div class="flex flex-column mt-2">
        <label for="numberOfIterations" class="p-label"
          >Number Of Iterations</label
        >
        <p-inputNumber
          id="numberOfIterations"
          formControlName="numberOfIterations"
        ></p-inputNumber>
      </div>
      <p-button
        label="Calculate Root"
        class="mt-2"
        (onClick)="calculateRoot()"
      ></p-button>
      <p *ngIf="root !== undefined" class="p-mt-3">
        Estimated Root: {{ root }}
      </p>
      <p-table *ngIf="iterationData.length" [value]="iterationData">
        <ng-template pTemplate="header">
          <tr>
            <th>Iteration</th>
            <th>x0</th>
            <th>f(x0)</th>
            <th>x1</th>
            <th>f(x1)</th>
            <th>x2</th>
            <th>f(x2)</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-data>
          <tr>
            <td>{{ data.iteration }}</td>
            <td>{{ data.x0 }}</td>
            <td>{{ data.fx0 }}</td>
            <td>{{ data.x1 }}</td>
            <td>{{ data.fx1 }}</td>
            <td>{{ data.x2 }}</td>
            <td>{{ data.fx2 }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecantMethodCalculatorComponent implements OnInit {
  root: number | undefined;
  form!: FormGroup;
  iterationData: any[] = [];

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      function:
        '(1.5 * x / (1 + x^2)^2) - (0.65 * atan(x)) + (0.65 * x / (1 + x^2))',
      x0: 0.2,
      x1: 1,
      numberOfIterations: 10,
    });
  }

  calculateRoot() {
    const functionString = this.form.get('function')?.value;
    let x0 = this.form.get('x0')?.value;
    let x1 = this.form.get('x1')?.value;
    const maxIterations = this.form.get('numberOfIterations')?.value;

    const f = (x: number) => evaluate(functionString, { x });
    this.iterationData = [];

    for (let i = 0; i < maxIterations; i++) {
      const fx0 = f(x0);
      const fx1 = f(x1);

      // const x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
      const x2 = x1 - fx1 * ((x1 - x0) / (fx1 - fx0));
      const fx2 = f(x2);

      this.iterationData.push({
        iteration: i + 1,
        x0,
        fx0,
        x1,
        fx1,
        x2,
        fx2,
      });

      if (fx2 === 0 || Math.abs(x2 - x1) < 1e-10) {
        this.root = x2;
        break;
      }

      x0 = x1;
      x1 = x2;

      this.root = x2;
    }
  }
}
