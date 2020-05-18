import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiveJob } from '../../models/live-job';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JobResume } from '../../models/job-resume';

@Component({
  selector: 'app-live-job-list',
  templateUrl: './live-job-list.component.html',
  styleUrls: ['./live-job-list.component.scss']
})
export class LiveJobListComponent implements OnInit {

  @Input() liveJobList: LiveJob[] = [];

  @Output() jobResume = new EventEmitter<JobResume>();

  constructor() { }

  ngOnInit(): void {
  }

  trackByFn(index: number, job: LiveJob) {
    return job?.jobId;
  }

}
