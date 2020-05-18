import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { JobResume } from '../../models/job-resume';
import { LiveJob } from '../../models/live-job';

@Component({
  selector: 'app-live-job-item',
  templateUrl: './live-job-item.component.html',
  styleUrls: ['./live-job-item.component.scss']
})
export class LiveJobItemComponent implements OnInit, OnChanges {

  @Input() job: LiveJob;

  @Output() jobResume = new EventEmitter<JobResume>();

  form = new FormGroup({
    condition: new FormControl('endProcessing'),
    conditionalBreak: new FormControl(false),
  });

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.job) {
      if (this.job?.unavailable) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  onJobClick(jobId: string) {
    const formValue = this.form.getRawValue();
    this.jobResume.emit({
      jobId,
      condition: formValue.conditionalBreak ? formValue.condition : null,
    });
  }

  clearCondition() {
    this.form.patchValue({
      condition: null,
    });
  }

}
