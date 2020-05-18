import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject, Observable, Subscription } from 'rxjs';
import * as dayjs from 'dayjs';
import { ViewerEvent } from '../../models/viewer-event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit, OnChanges {

  @Input() events: ViewerEvent[];
  @Input() currentEvent: ViewerEvent;
  @Input() resized: any;

  @Output() selectEvent = new EventEmitter<ViewerEvent>();

  @ViewChild('viewport', { static: true }) viewport: CdkVirtualScrollViewport;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.events) {
      this.viewport.elementRef.nativeElement.scrollTop = 0;
    }
    if (changes.resized) {
      this.viewport.checkViewportSize();
    }
  }

  eventSelected(event: ViewerEvent) {
    return this.currentEvent?.eventId === event.eventId;
  }

  onEventClick(event: ViewerEvent) {
    this.selectEvent.emit(event);
  }

  getDate(event: ViewerEvent) {
    return dayjs(event.timestamp).format('MM.DD.YYYY HH:mm:ss:SSS');
  }

  trackByFn(index: number, event: ViewerEvent) {
    return event?.eventId;
  }

}
