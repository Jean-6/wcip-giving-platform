import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {minMaxDateValidator} from '../../shared/validator/min-max-date.validator';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-report-panel',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePicker,
    NgIf
  ],
  templateUrl: './report-panel.html',
  styleUrl: './report-panel.css',
  standalone: true
})
export class ReportPanel {

  reportForm!: FormGroup;
  @Output() submitReport = new EventEmitter();

  constructor(private readonly fb: FormBuilder) {


    this.reportForm = this.fb.group({
        email: ['',
          [
            Validators.required,
            Validators.email
          ]
        ],
        minDate:['',
          [
            Validators.required
          ]
        ],
        maxDate:['',
          [
            Validators.required
          ]
        ],
      },
      { validators: minMaxDateValidator})
  }


  submitReportForm() {

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const toLocalDate = (date:Date): string => {

      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    const payload = {
      email: this.reportForm.value.email,
      startDate: toLocalDate(this.reportForm.value.minDate),
      endDate: toLocalDate(this.reportForm.value.maxDate)
    }
    console.log("payload:", JSON.stringify(payload));
    this.submitReport.emit(payload);

  }

}
