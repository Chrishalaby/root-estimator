import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  selector: 'app-false-position-calculator',
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
    <h1 class="p-card-title">False Position Method Calculator</h1>
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
        <label for="xu" class="p-label">Lower Bound (xu):</label>
        <p-inputNumber id="xu" formControlName="xu"></p-inputNumber>
      </div>
      <div class="flex flex-column mt-2">
        <label for="xl" class="p-label">Upper Bound (xl):</label>
        <p-inputNumber id="xl" formControlName="xl"></p-inputNumber>
      </div>
      <div class="flex flex-column mt-2">
        <label for="tolerance" class="p-label">Number Of Iterations</label>
        <p-inputNumber
          id="tolerance"
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
            <th>xl</th>
            <th>f(xl)</th>
            <th>xu</th>
            <th>f(xu)</th>
            <th>xr</th>
            <th>f(xr)</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-data>
          <tr>
            <td>{{ data.iteration }}</td>
            <td>{{ data.xl }}</td>
            <td>{{ data.fxl }}</td>
            <td>{{ data.xu }}</td>
            <td>{{ data.fxu }}</td>
            <td>{{ data.xr }}</td>
            <td>{{ data.fxr }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FalsePositionCalculatorComponent {
  root: number | undefined;
  form!: FormGroup;
  iterationData: any[] = [];

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      function: 'e^-x+2x-3',
      xu: 4,
      xl: 0,
      numberOfIterations: 10,
    });
  }

  calculateRoot() {
    const functionString = this.form.get('function')?.value;
    let xu = this.form.get('xu')?.value;
    let xl = this.form.get('xl')?.value;
    const maxIterations = this.form.get('numberOfIterations')?.value;

    const f = (x: number) => evaluate(functionString, { x });
    this.iterationData = [];

    for (let i = 0; i < maxIterations; i++) {
      const fxl = f(xl);
      const fxu = f(xu);
      // const xr = (xu * fxl - xl * fxu) / (fxl - fxu);
      const xr = xu - fxu * ((xu - xl) / (fxu - fxl));
      const fxr = f(xr);

      this.iterationData.push({
        iteration: i + 1,
        xl,
        fxl,
        xu,
        fxu,
        xr,
        fxr,
      });

      if (fxr === 0 || Math.abs(fxr) < 1e-10) {
        this.root = xr;
        break;
      }

      if (fxl * fxr < 0) {
        xu = xr;
      } else {
        xl = xr;
      }

      this.root = xr;
    }
  }
}
