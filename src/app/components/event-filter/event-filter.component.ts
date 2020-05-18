import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { EventFilter } from '../../models/event-filter';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss']
})
export class EventFilterComponent implements OnInit, OnDestroy {

  @Input() jobIds: string[];
  @Input() eventTypes: string[];

  @Output() applyFilter = new EventEmitter<EventFilter>();

  form = new FormGroup({
    jobIds: new FormControl([]),
    eventTypes: new FormControl([]),
    text: new FormControl(),
  });
  formValueChanges$: Subscription;

  constructor() {
    this.formValueChanges$ = this.form.valueChanges.subscribe((x: EventFilter) => {
      this.applyFilter.emit(x);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.formValueChanges$.unsubscribe();
  }

  clearJobIds() {
    this.form.patchValue({
      jobIds: [],
    });
  }

  clearEventTypes() {
    this.form.patchValue({
      eventTypes: [],
    });
  }

  clearText() {
    this.form.patchValue({
      text: null,
    });
  }


}
