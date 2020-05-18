import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EventFilter } from '../../models/event-filter';
import { selectEventTypes, selectJobIdsFromEvents } from '../../store';
import { filterEvents } from '../../store/event.actions';

@Component({
  selector: 'app-event-filter-container',
  templateUrl: './event-filter-container.component.html',
  styleUrls: ['./event-filter-container.component.scss']
})
export class EventFilterContainerComponent implements OnInit {

  jobIds$: Observable<string[]>;
  eventTypes$: Observable<string[]>;

  constructor(public store: Store) {
    this.jobIds$ = store.select(selectJobIdsFromEvents);
    this.eventTypes$ = store.select(selectEventTypes);
  }

  ngOnInit(): void {
  }

  onApplyFilter($event: EventFilter) {
    this.store.dispatch(filterEvents({ filter: $event }));
  }

}
