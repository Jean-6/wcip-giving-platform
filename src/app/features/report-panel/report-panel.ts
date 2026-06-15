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

    const payload = {
      email: this.reportForm.value.email,
      startDate : this.reportForm.value.minDate,
      endDate: this.reportForm.value.maxDate
    }

    this.submitReport.emit(payload);

  }

}
