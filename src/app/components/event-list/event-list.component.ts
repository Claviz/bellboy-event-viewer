import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnDestroy, HostListener, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
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
  @ViewChildren('event') eventElements: any;

  constructor(private ref: ChangeDetectorRef) { }

  onKeyDown(keyboardEvent: KeyboardEvent, viewerEvent: ViewerEvent) {
    if (keyboardEvent.key !== 'Tab') {
      keyboardEvent.preventDefault();
    }
    if (keyboardEvent.key === 'Enter') {
      this.selectEvent.emit(viewerEvent);
    } else if (keyboardEvent.key === 'ArrowUp' || keyboardEvent.key === 'ArrowDown') {
      const eventIndex = this.events.indexOf(viewerEvent);
      if ((keyboardEvent.key === 'ArrowUp' ? eventIndex : this.events.length - eventIndex - 1) > 0) {
        const nextIndex = eventIndex - (keyboardEvent.key === 'ArrowUp' ? 1 : -1);
        this.selectEvent.emit(this.events[nextIndex]);
      }
    }
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.events) {
      this.viewport.elementRef.nativeElement.scrollTop = 0;
    }
    if (changes.resized) {
      this.viewport.checkViewportSize();
    }
    if (changes.currentEvent && this.currentEvent) {
      this.ref.detectChanges();
      const eventIndex = this.events.indexOf(this.currentEvent);
      this.eventElements._results.map(x => x.nativeElement)[eventIndex].focus();
    }
  }

  eventSelected(event: ViewerEvent) {
    return this.currentEvent?.eventId === event.eventId;
  }

  onEventClick(event: ViewerEvent) {
    this.selectEvent.emit(event);
  }

  getDate(event: ViewerEvent) {
    return dayjs(event.timestamp).format('DD.MM.YYYY HH:mm:ss:SSS');
  }

  trackByFn(index: number, event: ViewerEvent) {
    return event?.eventId;
  }

}
