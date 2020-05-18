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
    // on(UserActions.setUser, (state, { user }) => {
    //     return adapter.setOne(user, state)
    // }),
    // on(UserActions.upsertUser, (state, { user }) => {
    //     return adapter.upsertOne(user, state);
    // }),
    // on(UserActions.addUsers, (state, { users }) => {
    //     return adapter.addMany(users, state);
    // }),
    // on(UserActions.upsertUsers, (state, { users }) => {
    //     return adapter.upsertMany(users, state);
    // }),
    // on(UserActions.updateUser, (state, { update }) => {
    //     return adapter.updateOne(update, state);
    // }),
    // on(UserActions.updateUsers, (state, { updates }) => {
    //     return adapter.updateMany(updates, state);
    // }),
    // on(UserActions.mapUsers, (state, { entityMap }) => {
    //     return adapter.map(entityMap, state);
    // }),
    // on(UserActions.deleteUser, (state, { id }) => {
    //     return adapter.removeOne(id, state);
    // }),
    // on(UserActions.deleteUsers, (state, { ids }) => {
    //     return adapter.removeMany(ids, state);
    // }),
    // on(UserActions.deleteUsersByPredicate, (state, { predicate }) => {
    //     return adapter.removeMany(predicate, state);
    // }),
    // on(UserActions.loadUsers, (state, { users }) => {
    //     return adapter.setAll(users, state);
    // }),
    // on(UserActions.clearUsers, state => {
    //     return adapter.removeAll({ ...state, selectedUserId: null });
    // })
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