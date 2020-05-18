import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { LiveJob } from '../../models/live-job';
import { selectLiveJobList } from '../../store';
import { resumeJob } from '../../store/live-job.actions';
import { JobResume } from '../../models/job-resume';

@Component({
  selector: 'app-live-job-list-container',
  templateUrl: './live-job-list-container.component.html',
  styleUrls: ['./live-job-list-container.component.scss']
})
export class LiveJobListContainerComponent implements OnInit {

  liveJobList$: Observable<LiveJob[]>;

  constructor(public store: Store) {
    this.liveJobList$ = store.select(selectLiveJobList);
  }

  ngOnInit(): void {
  }

  onJobResume($event: JobResume) {
    this.store.dispatch(resumeJob({ jobResume: $event }));
  }

}
