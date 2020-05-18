import { createAction, props } from '@ngrx/store';
import { EventFilter } from '../models/event-filter';
import { ViewerEvent } from '../models/viewer-event';

export const addEvents = createAction('[Event/API] Add events', props<{ events: ViewerEvent[] }>());
export const selectEvent = createAction('[Event/list section] Select event', props<{ eventId: string }>());
export const filterEvents = createAction('[Event/event filter section] Filter events', props<{ filter: EventFilter }>());