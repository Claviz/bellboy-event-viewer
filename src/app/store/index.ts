import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { EventFilter } from '../models/event-filter';
import * as fromEvent from './event.reducer';
import * as fromLiveJobEvent from './live-job.reducer';
import { ViewerEvent } from '../models/viewer-event';
import { TextFilterResult } from '../models/text-filter-result';

export interface State {
    events: fromEvent.State;
    liveJobs: fromLiveJobEvent.State;
}

export const reducers: ActionReducerMap<State> = {
    events: fromEvent.reducer,
    liveJobs: fromLiveJobEvent.reducer,
};

export const selectEventState = createFeatureSelector<fromEvent.State>('events');
export const selectLiveJobState = createFeatureSelector<fromLiveJobEvent.State>('liveJobs');

export const selectEventIds = createSelector(
    selectEventState,
    fromEvent.selectEventIds
);
export const selectEventEntities = createSelector(
    selectEventState,
    fromEvent.selectEventEntities
);
export const selectAllEvents = createSelector(
    selectEventState,
    fromEvent.selectAllEvents
);

export const selectCurrentEventId = createSelector(
    selectEventState,
    fromEvent.getSelectedEventId
);

export const selectEventFilter = createSelector(
    selectEventState,
    fromEvent.getEventFilter
);

export const selectCurrentEvent = createSelector(
    selectEventEntities,
    selectCurrentEventId,
    (eventEntities, eventId) => eventEntities[eventId]
);

export const selectCurrentEventTextFilterResult = createSelector(
    selectCurrentEvent,
    selectEventFilter,
    (event, filter) => {
        const highlightedLines: number[] = [];
        if (filter.text && event?.eventArgumentsStringified) {
            const splitText = event.eventArgumentsStringified.split('\n');
            for (let i = 0; i < splitText.length; i++) {
                if (textContains(splitText[i], filter.text)) {
                    highlightedLines.push(i + 1)
                }
            }
        }
        return { event, highlightedLines } as TextFilterResult;
    }
);

export const selectAllLiveJobs = createSelector(
    selectLiveJobState,
    fromLiveJobEvent.selectAllLiveJobs,
);

export const selectMostRecentEvent = createSelector(
    selectAllEvents,
    (events) => events[0],
)

export const selectEventFilterText = createSelector(
    selectEventFilter,
    (eventFilter) => eventFilter.text
);

export const selectFilteredEvents = createSelector(
    selectAllEvents,
    selectEventFilter,
    (events, filter) => {
        const filteredEvents: ViewerEvent[] = [];
        for (const event of events) {
            if (shouldFilter(event, filter)) {
                filteredEvents.push(event);
            }
        }

        return filteredEvents;
    }
);

function textContains(text: string, toContain: string) {
    return text.toLowerCase().includes(toContain.toLowerCase());
}

function shouldFilter(event: ViewerEvent, filter: EventFilter) {
    if (filter.jobIds?.length && !filter.jobIds.includes(event.jobId)) {
        return false;
    }
    if (filter.eventTypes?.length && !filter.eventTypes.includes(event.eventName)) {
        return false;
    }
    if (filter.text && !textContains(event.eventArgumentsStringified, filter.text)) {
        return false;
    }

    return true;
}

export const selectEventTypes = createSelector(
    selectAllEvents,
    (events) => {
        return [...new Set(events.map(x => x.eventName))];
    }
);

export const selectJobIdsFromEvents = createSelector(
    selectAllEvents,
    (events) => {
        return [...new Set(events.map(x => x.jobId))];
    }
);

export const selectLiveJobList = createSelector(
    selectAllLiveJobs,
    selectJobIdsFromEvents,
    (jobs, eventJobIds) => {
        if (eventJobIds.length) {
            const sortedJobs = [];
            for (let jobId of eventJobIds) {
                const job = jobs.find(x => x.jobId === jobId);
                if (job) {
                    sortedJobs.push(job);
                }
            }
            const leftJobs = jobs.filter(x => !eventJobIds.includes(x.jobId));
            return [...sortedJobs, ...leftJobs];
        }
        return jobs;
    },
);