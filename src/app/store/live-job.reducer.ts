import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { LiveJob } from '../models/live-job';
import * as LiveJobActions from './live-job.actions';

export interface State extends EntityState<LiveJob> {
}

export const adapter: EntityAdapter<LiveJob> = createEntityAdapter<LiveJob>({
    selectId: (x) => x.jobId,
});

export const initialState: State = adapter.getInitialState({
});

const liveJobReducer = createReducer(
    initialState,
    on(LiveJobActions.resumeJob, (state, { jobResume }) => {
        return adapter.setOne({ ...state.entities[jobResume.jobId], unavailable: true, }, state);
    }),
    on(LiveJobActions.addLiveJobs, (state, { jobIds }) => {
        return adapter.upsertMany(jobIds.map(x => ({ jobId: x, unavailable: false, })), state);
    }),
    on(LiveJobActions.removeLiveJobs, (state, { jobIds }) => {
        return adapter.upsertMany(jobIds.map(x => ({ jobId: x, unavailable: true, })), state);
    })
);

export function reducer(state: State | undefined, action: Action) {
    return liveJobReducer(state, action);
}

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();

export const selectLiveJobIds = selectIds;

export const selectLiveJobEntities = selectEntities;

export const selectAllLiveJobs = selectAll;

export const selectLiveJobTotal = selectTotal;