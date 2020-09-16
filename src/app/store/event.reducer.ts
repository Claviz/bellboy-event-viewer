import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as eventActions from './event.actions';
import { EventFilter } from '../models/event-filter';
import { ViewerEvent } from '../models/viewer-event';

export interface State extends EntityState<ViewerEvent> {
    selectedEventId: string | null;
    filter: EventFilter;
}

export const adapter: EntityAdapter<ViewerEvent> = createEntityAdapter<ViewerEvent>({
    sortComparer: (a, b) => b.timestamp - a.timestamp,
    selectId: (x) => x.eventId,
});

export const initialState: State = adapter.getInitialState({
    selectedEventId: null,
    filter: {
        jobIds: [],
        eventTypes: [],
        text: null,
    }
});

const eventReducer = createReducer(
    initialState,
    on(eventActions.addEvents, (state, { events }) => {
        return adapter.addMany(events, state)
    }),
    on(eventActions.selectEvent, (state, { eventId }) => {
        return { ...state, selectedEventId: state.selectedEventId === eventId ? null : eventId }
    }),
    on(eventActions.filterEvents, (state, { filter }) => {
        return { ...state, filter };
    })
);

export function reducer(state: State | undefined, action: Action) {
    return eventReducer(state, action);
}

export const getSelectedEventId = (state: State) => state.selectedEventId;
export const getEventFilter = (state: State) => state.filter;

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();

export const selectEventIds = selectIds;

export const selectEventEntities = selectEntities;

export const selectAllEvents = selectAll;

export const selectEventTotal = selectTotal;