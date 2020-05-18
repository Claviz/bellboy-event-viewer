import { createAction, props } from '@ngrx/store';
import { JobResume } from '../models/job-resume';

export const addLiveJobs = createAction('[Live job/API] Add live jobs', props<{ jobIds: string[] }>());
export const removeLiveJobs = createAction('[Live job/API] Remove live jobs', props<{ jobIds: string[] }>());
export const resumeJob = createAction('[Live job/live job list] Resume job', props<{ jobResume: JobResume }>());
