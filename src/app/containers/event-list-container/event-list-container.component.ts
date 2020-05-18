import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { ViewerEvent } from '../../models/viewer-event';
import { selectCurrentEvent, selectFilteredEvents } from '../../store';
import { selectEvent } from '../../store/event.actions';

@Component({
  selector: 'app-event-list-container',
  templateUrl: './event-list-container.component.html',
  styleUrls: ['./event-list-container.component.scss']
})
export class EventListContainerComponent implements OnInit {

  @Input() resized$: Subject<any>;

  events$: Observable<ViewerEvent[]>;
  currentEvent$: Observable<ViewerEvent>;

  constructor(public store: Store) {
    this.events$ = store.select(selectFilteredEvents);
    this.currentEvent$ = store.select(selectCurrentEvent);
  }

  ngOnInit(): void {
  }

  onSelectEvent(event$: ViewerEvent) {
    this.store.dispatch(selectEvent({ eventId: event$.eventId }));
  }

}
